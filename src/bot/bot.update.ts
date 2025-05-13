import {
  Command,
  Start,
  Update,
  On,
  Ctx,
  Message,
  Hears,
} from 'nestjs-telegraf';
import { SCENE_ID } from '../app.constants';
import { Context } from '../interfaces/context.interface';
import { Logger } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { ENDPOINTS } from './bot.endpoints';
import { SettingsService } from '../settings/settings.service';

@Update()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name, { timestamp: true });

  constructor(
    private readonly settingsService: SettingsService,
    private readonly openAiService: OpenaiService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    try {;
      await ctx.scene.enter(SCENE_ID.MAIN);
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  @Command('main')
  @Hears(ENDPOINTS.MAIN)
  async onMain(@Ctx() ctx: Context) {
    try {
      await ctx.scene.enter(SCENE_ID.MAIN);
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  @Hears(ENDPOINTS.FEEDBACK)
  async feedback(@Ctx() ctx: Context) {
    try {
      return ctx.scene.enter(SCENE_ID.FEEDBACK);
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  @Hears(ENDPOINTS.SETTINGS)
  async settings(@Ctx() ctx: Context) {
    try {
      return ctx.scene.enter(SCENE_ID.SETTINGS);
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') text: string) {
    try {
      return ctx.reply(text);
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }
}
