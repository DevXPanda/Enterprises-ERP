// Admin profile and credential management backing the Settings page.
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { AppUser, AppUserEntity } from './user.entity';

const DEFAULT_ADMIN = {
  name: 'Kushal Sharma',
  email: 'admin@nktech.in',
  phone: '+91 98765 43210',
  role: 'Super Admin',
  password: 'admin123',
};

@Injectable()
export class SettingsService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo(): Repository<AppUser> {
    return this.dataSource.getRepository(AppUserEntity);
  }

  private hash(password: string, salt: string): string {
    return scryptSync(password, salt, 64).toString('hex');
  }

  private toProfile(user: AppUser) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      updatedAt: user.updatedAt,
    };
  }

  private async currentUser(): Promise<AppUser> {
    let user = await this.repo.findOne({ where: {}, order: { id: 'ASC' } });
    if (!user) {
      const salt = randomBytes(16).toString('hex');
      user = await this.repo.save(
        this.repo.create({
          name: DEFAULT_ADMIN.name,
          email: DEFAULT_ADMIN.email,
          phone: DEFAULT_ADMIN.phone,
          role: DEFAULT_ADMIN.role,
          passwordSalt: salt,
          passwordHash: this.hash(DEFAULT_ADMIN.password, salt),
        }),
      );
    }
    return user;
  }

  async getProfile() {
    return this.toProfile(await this.currentUser());
  }

  async updateProfile(body: {
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string | null;
  }) {
    const user = await this.currentUser();
    if (body.name !== undefined) user.name = String(body.name).trim();
    if (body.email !== undefined) user.email = String(body.email).trim().toLowerCase();
    if (body.phone !== undefined) user.phone = String(body.phone).trim();
    if (body.avatarUrl !== undefined) user.avatarUrl = body.avatarUrl;
    if (!user.name || !user.email) {
      throw new BadRequestException('Name and email are required');
    }
    return this.toProfile(await this.repo.save(user));
  }

  async changePassword(body: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) {
    const { currentPassword, newPassword, confirmPassword } = body;
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('currentPassword and newPassword are required');
    }
    if (newPassword.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters');
    }
    if (confirmPassword !== undefined && confirmPassword !== newPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const user = await this.currentUser();
    const given = Buffer.from(this.hash(currentPassword, user.passwordSalt), 'hex');
    const stored = Buffer.from(user.passwordHash, 'hex');
    if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordSalt = randomBytes(16).toString('hex');
    user.passwordHash = this.hash(newPassword, user.passwordSalt);
    await this.repo.save(user);
    return { changed: true };
  }
}
