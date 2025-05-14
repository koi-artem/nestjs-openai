import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { SCENE_ID } from '../../../app.constants';
import { Markup } from 'telegraf';
import { FeedbackService } from '../../../feedback/feedback.service';
import { Context } from '../../../interfaces/context.interface';
import { Logger } from '@nestjs/common';

@Wizard(SCENE_ID.FEEDBACK)
export class FeedbackWizard {
  private readonly logger = new Logger(FeedbackWizard.name, {
    timestamp: true,
  });

  constructor(private readonly feedbackService: FeedbackService) {}
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<void> {
    ctx.wizard.next();
    await ctx.reply(
      'Your feedback is valuable for us! What\'s on your mind?',
      Markup.removeKeyboard(),
    );
  }

  @On('text')
  @WizardStep(2)
  async onFeedback(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<void> {
    const feedback = msg.text;

    try {
      await this.feedbackService.createFeedback(
        ctx.from.id.toString(),
        feedback,
      );
      await ctx.reply('Thanks for the feedback! ✨');
    } catch (e) {
      this.logger.error(e.message, e.stack);
    } finally {
      await ctx.scene.enter(SCENE_ID.MAIN);
    }
  }

  @On('audio')
  async onAudio(@Ctx() ctx: Context) {
    return 'Please leave a text message 🫣';
  }
}
