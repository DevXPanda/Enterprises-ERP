// Root module — config, TypeORM (Neon) and feature modules.
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitySchemas } from './resources/entity.factory';
import { ResourcesModule } from './resources/resources.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WagesModule } from './wages/wages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: entitySchemas,
        synchronize: true,
      }),
    }),

    DashboardModule,
    WagesModule,
    ResourcesModule,
  ],
})
export class AppModule {}
