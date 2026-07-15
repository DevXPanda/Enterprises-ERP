// Root module — config, TypeORM (Neon) and feature modules.
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitySchemas } from './resources/entity.factory';
import { ResourcesModule } from './resources/resources.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WagesModule } from './wages/wages.module';
import { ManufacturingModule } from './manufacturing/manufacturing.module';
import { SettingsModule } from './settings/settings.module';
import { AppUserEntity } from './settings/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [...entitySchemas, AppUserEntity],
        synchronize: true,
      }),
    }),

    DashboardModule,
    WagesModule,
    ManufacturingModule,
    SettingsModule,
    ResourcesModule,
  ],
})
export class AppModule {}
