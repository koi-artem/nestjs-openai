import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TelegramError } from 'telegraf';

@Catch(TelegramError)
export class CustomTelegrafException implements ExceptionFilter {
  catch(exception: TelegramError, host: ArgumentsHost) {
    Logger.error(
      `Global exception handler: ${exception.message}`,
      exception.stack,
    );
    return;
  }
}
