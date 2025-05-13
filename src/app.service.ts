import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BOT_NAME } from './app.constants';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name, { timestamp: true });

  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>,
  ) {
    bot.telegram
      .setMyCommands([
        {
          command: 'main',
          description: 'Повернутись до головного меню',
        },
      ])
      .then(() => {
        this.logger.log('Commands set successfully!');
      })
      .catch((e) => {
        console.error(e.message);
      });
  }
}
