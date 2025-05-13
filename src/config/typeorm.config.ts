import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as process from 'process';
config({ override: false });

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST') || process.env.POSTGRES_HOST,
  port: +(
    configService.get<string>('POSTGRES_PORT') || process.env.POSTGRES_PORT
  ),
  username:
    configService.get<string>('POSTGRES_USER') || process.env.POSTGRES_USER,
  password:
    configService.get<string>('POSTGRES_PASSWORD') ||
    process.env.POSTGRES_PASSWORD,
  database:
    configService.get<string>('POSTGRES_DATABASE') ||
    process.env.POSTGRES_DATABASE,
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
