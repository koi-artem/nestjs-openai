import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FindManyOptions, Repository } from 'typeorm';
import { Settings } from './settings.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SettingsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async create(telegramId: string, newSettings: Partial<Settings>) {
    const user = await this.usersService.getUser(telegramId);

    const settings = await this.settingsRepository.findOne({
      where: { user: { telegramId } },
    });

    const entity = this.settingsRepository.create({
        ...(settings ? settings : {}),
        ...newSettings,
      user,
    });

    return this.settingsRepository.save(entity);
  }

  async update(telegramId: string, data: Partial<Settings>) {
    const settings = await this.settingsRepository.findOne({
      where: { user: { telegramId } },
    });
    return this.settingsRepository.save({ ...settings, ...data });
  }

  async getLatest(telegramId: string): Promise<Settings | null> {
    const settings = await this.settingsRepository.findOne({
      where: { user: { telegramId } },
      order: { created_at: 'DESC' },
    });
    return settings || null;
  }

  async getUserWithSettings(where: FindManyOptions<Settings>) {
    return this.settingsRepository.find({ ...where, relations: ['user'] });
  }
}
