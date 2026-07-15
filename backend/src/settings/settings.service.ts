// Settings page backend — manages the super_admin account (same identity used
// for login) including the avatar image stored in the database as a data URL.
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { SuperAdmin, SuperAdminEntity } from '../auth/super-admin.entity';

const DEFAULT_SUPER_ADMIN = {
  email: 'nktech@gmail.com',
  name: 'NKTech Admin',
  role: 'Super Admin',
  password: '123456',
};

const IMAGE_RE = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // ~2 MB decoded

@Injectable()
export class SettingsService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo(): Repository<SuperAdmin> {
    return this.dataSource.getRepository(SuperAdminEntity);
  }

  private hash(password: string, salt: string): string {
    return scryptSync(password, salt, 64).toString('hex');
  }

  private toProfile(user: SuperAdmin) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatar,
      updatedAt: user.updatedAt,
    };
  }

  private async currentUser(): Promise<SuperAdmin> {
    let user = await this.repo.findOne({ where: {}, order: { id: 'ASC' } });
    if (!user) {
      const salt = randomBytes(16).toString('hex');
      user = await this.repo.save(
        this.repo.create({
          email: DEFAULT_SUPER_ADMIN.email,
          name: DEFAULT_SUPER_ADMIN.name,
          role: DEFAULT_SUPER_ADMIN.role,
          passwordSalt: salt,
          passwordHash: this.hash(DEFAULT_SUPER_ADMIN.password, salt),
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

    if (body.avatarUrl !== undefined) {
      if (body.avatarUrl === null || body.avatarUrl === '') {
        user.avatar = null;
      } else {
        const data = String(body.avatarUrl);
        if (!IMAGE_RE.test(data)) {
          throw new BadRequestException('Avatar must be a PNG, JPG, WEBP or GIF image');
        }
        const approxBytes = (data.length * 3) / 4;
        if (approxBytes > MAX_IMAGE_BYTES) {
          throw new BadRequestException('Avatar image must be under 2 MB');
        }
        user.avatar = data;
      }
    }

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
    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
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
