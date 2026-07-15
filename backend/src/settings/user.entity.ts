// Admin user account table (app_users) backing the Settings page.
import { EntitySchema } from 'typeorm';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  passwordSalt: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AppUserEntity = new EntitySchema<AppUser>({
  name: 'app_users',
  tableName: 'app_users',
  columns: {
    id: { type: 'int', primary: true, generated: 'increment' },
    name: { type: 'varchar', length: 150 },
    email: { type: 'varchar', length: 200, unique: true },
    phone: { type: 'varchar', length: 30, nullable: true },
    role: { type: 'varchar', length: 50, default: 'Super Admin' },
    avatarUrl: { type: 'varchar', length: 500, nullable: true },
    passwordSalt: { type: 'varchar', length: 64 },
    passwordHash: { type: 'varchar', length: 200 },
    createdAt: { type: 'timestamptz', createDate: true },
    updatedAt: { type: 'timestamptz', updateDate: true },
  },
});
