// Login verification against the super_admin table.
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { SuperAdmin, SuperAdminEntity } from './super-admin.entity';

const DEFAULT_SUPER_ADMIN = {
  email: 'nktech@gmail.com',
  name: 'NKTech Admin',
  role: 'Super Admin',
  password: '123456',
};

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo(): Repository<SuperAdmin> {
    return this.dataSource.getRepository(SuperAdminEntity);
  }

  private hash(password: string, salt: string): string {
    return scryptSync(password, salt, 64).toString('hex');
  }

  /** Creates the configured super admin on first run. */
  private async ensureSuperAdmin(): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) return;
    const salt = randomBytes(16).toString('hex');
    await this.repo.save(
      this.repo.create({
        email: DEFAULT_SUPER_ADMIN.email,
        name: DEFAULT_SUPER_ADMIN.name,
        role: DEFAULT_SUPER_ADMIN.role,
        passwordSalt: salt,
        passwordHash: this.hash(DEFAULT_SUPER_ADMIN.password, salt),
      }),
    );
  }

  async login(body: { email?: string; password?: string }) {
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    await this.ensureSuperAdmin();

    const admin = await this.repo.findOne({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const given = Buffer.from(this.hash(password, admin.passwordSalt), 'hex');
    const stored = Buffer.from(admin.passwordHash, 'hex');
    if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      success: true,
      token: randomBytes(24).toString('hex'),
      admin: { email: admin.email, name: admin.name, role: admin.role },
    };
  }

  async changePassword(body: {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const email = String(body.email ?? '').trim().toLowerCase();
    const { currentPassword, newPassword } = body;
    if (!email || !currentPassword || !newPassword) {
      throw new BadRequestException('email, currentPassword and newPassword are required');
    }
    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    await this.ensureSuperAdmin();
    const admin = await this.repo.findOne({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid email or password');

    const given = Buffer.from(this.hash(currentPassword, admin.passwordSalt), 'hex');
    const stored = Buffer.from(admin.passwordHash, 'hex');
    if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    admin.passwordSalt = randomBytes(16).toString('hex');
    admin.passwordHash = this.hash(newPassword, admin.passwordSalt);
    await this.repo.save(admin);
    return { changed: true };
  }
}
