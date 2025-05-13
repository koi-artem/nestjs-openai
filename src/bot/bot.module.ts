import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotUpdate } from './bot.update';
import { UsersModule } from '../users/users.module';
import { OpenaiModule } from '../openai/openai.module';
import { ProfileWizard } from './wizards/profile/profile.wizard';
import { SettingsModule } from '../settings/settings.module';
import { SettingsScene } from './scenes/settings.scene';
import { MainScene } from './scenes/main.scene';
import { FeedbackWizard } from './wizards/feedback/feedback.wizard';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [
    OpenaiModule,
    UsersModule,
    ConfigModule,
    SettingsModule,
    FeedbackModule,
  ],
  providers: [
    BotUpdate,
    MainScene,
    ProfileWizard,
    FeedbackWizard,
    SettingsScene,
  ],
})
export class BotModule {}
