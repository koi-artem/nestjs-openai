import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UsersModule } from '../users/users.module';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings]), UsersModule],
  providers: [SettingsService],
  exports: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {}
