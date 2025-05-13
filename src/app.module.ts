import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenaiModule } from './openai/openai.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { UsersModule } from './users/users.module';
import { BOT_NAME } from './app.constants';
import { BotModule } from './bot/bot.module';
import { sessionMiddleware } from './bot/middleware/session.middleware';
import { SettingsModule } from './settings/settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Settings } from './settings/settings.entity';
import { FeedbackModule } from './feedback/feedback.module';
import { Feedback } from './feedback/feedback.entity';
import { UserMiddleware } from './users/user.middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: +configService.get<string>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [User, Settings, Feedback],
        synchronize: false,
        retryAttempts: 5,
      }),
    }),
    OpenaiModule,
    UsersModule,
    BotModule,
    SettingsModule,
    FeedbackModule,
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      imports: [ConfigModule, UsersModule],
      useFactory: (
        configService: ConfigService,
        userMiddleware: UserMiddleware,
      ) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN'),
        middlewares: [sessionMiddleware, userMiddleware.use],
        launchOptions: {
          webhook: {
            port: 3001,
            domain: configService.get('TELEGRAM_BOT_DOMAIN'),
            path: configService.get('TELEGRAM_BOT_PATH'),
          },
        },
      }),
      inject: [ConfigService, UserMiddleware],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
