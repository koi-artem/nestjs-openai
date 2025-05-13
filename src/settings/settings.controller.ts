import { Controller, Get, Query } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('goal')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  @Get()
  @ApiQuery({ name: 'id', description: 'User ID' })
  async findAll(@Query('id') id: string) {
    return await this.settingsService.getLatest(id);
  }
}
