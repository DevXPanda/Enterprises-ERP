// Super admin login credentials table (super_admin).
import { EntitySchema } from 'typeorm';

export interface SuperAdmin {
  id: number;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  avatar: string | null;
  passwordSalt: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SuperAdminEntity = new EntitySchema<SuperAdmin>({
  name: 'super_admin',
  tableName: 'super_admin',
  columns: {
    id: { type: 'int', primary: true, generated: 'increment' },
    email: { type: 'varchar', length: 200, unique: true },
    name: { type: 'varchar', length: 150, default: 'Super Admin' },
    role: { type: 'varchar', length: 50, default: 'Super Admin' },
    phone: { type: 'varchar', length: 30, nullable: true },
    avatar: { type: 'text', nullable: true }, // base64 data URL stored in DB
    passwordSalt: { type: 'varchar', length: 64 },
    passwordHash: { type: 'varchar', length: 200 },
    createdAt: { type: 'timestamptz', createDate: true },
    updatedAt: { type: 'timestamptz', updateDate: true },
  },
});
