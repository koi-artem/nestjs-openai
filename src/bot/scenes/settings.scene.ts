import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SCENE_ID } from '../../app.constants';
import { Context } from '../../interfaces/context.interface';
import { Markup } from 'telegraf';
import { Injectable, Logger } from '@nestjs/common';
import { ENDPOINTS } from '../bot.endpoints';
import { SettingsService } from '../../settings/settings.service';
import { Settings } from '../../settings/settings.entity';

const renderSettings = (settings: Settings) => {
  return `Current settings:\n ${JSON.stringify(settings)}`;
};

@Scene(SCENE_ID.SETTINGS)
@Injectable()
export class SettingsScene {
  private readonly logger = new Logger(SettingsScene.name, { timestamp: true });
  constructor(private readonly settingsService: SettingsService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    try {
      await ctx.reply('Settings menu', {
        ...Markup.keyboard([Markup.button.text(ENDPOINTS.MAIN)]).resize(),
      });
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }

    try {
      const settings = await this.settingsService.getLatest(
        ctx.from.id.toString(),
      );

      const buttons = [
        [
          {
            text: 'Configure profile',
            callback_data: 'main_settings',
          },
        ],
      ];

      await ctx.reply(renderSettings(settings), {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons),
      });
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }


  @Action('main_settings')
  async onMainSettings(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(SCENE_ID.PROFILE);
  }
}
