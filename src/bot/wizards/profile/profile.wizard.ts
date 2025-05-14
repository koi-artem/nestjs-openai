import { Action, Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { SCENE_ID } from '../../../app.constants';
import { Markup } from 'telegraf';
import { SettingsService } from '../../../settings/settings.service';

@Wizard(SCENE_ID.PROFILE)
export class ProfileWizard {
  constructor(private readonly settingsService: SettingsService) {}
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    ctx.wizard.next();
    await ctx.reply(
      'Вкажи свій вік (від 14 до 80 років):',
      Markup.removeKeyboard(),
    );
  }

  @On('text')
  @WizardStep(2)
  async onAge(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    const value = parseInt(msg.text);

    if (isNaN(value) || value <= 14 || value >= 80) {
      ctx.wizard.selectStep(1);
      return 'Будь ласка, введи коректний вік від 14 до 80 років:';
    }

    ctx.wizard.state['age'] = value;

    const inlineKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Чоловік', 'gender-1')],
      [Markup.button.callback('Жінка', 'gender-2')],
    ]);


    ctx.wizard.next();
    await ctx.replyWithHTML('Вкажи свою стать:', {
      ...inlineKeyboard,
    });
  }

  @Action(/gender-.*/)
  @WizardStep(3)
  async onGender(@Ctx() ctx: WizardContext) {
    await ctx.answerCbQuery();
    const value = parseInt((ctx as any).match[0].replace('gender-', ''));

    if (isNaN(value) || value < 1 || value > 2) {
      ctx.wizard.selectStep(2);
      return 'Будь ласка, вибери стать зі списку:';
    }

    ctx.wizard.state['gender'] = value;
    try {
      const { age, gender } = ctx.wizard.state as any;

      await this.settingsService.create(ctx.from.id.toString(), {
        age,
        gender
      });
    } catch (e) {
      console.error(e.message);
    }

    await ctx.scene.enter(SCENE_ID.SETTINGS);
  }
}
