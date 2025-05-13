import { Action, Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { SCENE_ID } from '../../../app.constants';
import { formatResults } from './profile.helpers';
import { Markup } from 'telegraf';
import { SettingsService } from '../../../settings/settings.service';

@Wizard(SCENE_ID.PROFILE)
export class ProfileWizard {
  constructor(private readonly settingsService: SettingsService) {}
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    ctx.wizard.next();
    await ctx.reply(
      'Я допоможу тобі досягти твоєї мети 🎯\nВкажи свій вік (від 14 до 80 років):',
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
    ctx.wizard.next();
    return 'Вкажи свій зріст в сантиметрах (від 140 до 220 см):';
  }

  @On('text')
  @WizardStep(3)
  async onHeight(
    @Ctx() ctx: WizardContext & { wizard: { state: { name: string } } },
    @Message() msg: { text: string },
  ): Promise<string> {
    const value = parseInt(msg.text);

    if (isNaN(value) || value <= 140 || value >= 220) {
      ctx.wizard.selectStep(2);
      return 'Будь ласка, введи коректний зріст від 140 до 220 см:';
    }

    ctx.wizard.state['height'] = value;
    ctx.wizard.next();
    return 'Вкажи свою вагу в кілограмах (від 40 до 200 кг):';
  }

  @On('text')
  @WizardStep(4)
  async onWeight(@Ctx() ctx: WizardContext, @Message() msg: { text: string }) {
    const value = parseInt(msg.text);

    if (isNaN(value) || value <= 40 || value >= 200) {
      ctx.wizard.selectStep(3);
      return 'Будь ласка, введи коректну вагу від 40 до 200 кг:';
    }

    ctx.wizard.state['weight'] = value;
    ctx.wizard.next();

    await ctx.replyWithHTML('Вибери свій рівень фізичної активності:', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Мінімальна активність',
              callback_data: 'activity-1',
            },
          ],
          [
            {
              text: 'Помірна активність',
              callback_data: 'activity-2',
            },
          ],
          [
            {
              text: 'Активний спосіб життя',
              callback_data: 'activity-3',
            },
          ],
          [
            {
              text: 'Висока активність',
              callback_data: 'activity-4',
            },
          ],
          [
            {
              text: 'Дуже висока активність',
              callback_data: 'activity-5',
            },
          ],
        ],
      },
    });
  }

  @Action(/activity-.+/)
  @WizardStep(5)
  async onActivity(@Ctx() ctx: WizardContext) {
    await ctx.answerCbQuery();
    const value = parseInt((ctx as any).match[0].replace('activity-', ''));

    if (isNaN(value) || value < 1 || value > 5) {
      ctx.wizard.selectStep(4);
      return 'Будь ласка, вибери рівень активності зі списку:';
    }

    ctx.wizard.state['activity'] = value;

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
  @WizardStep(6)
  async onGender(@Ctx() ctx: WizardContext) {
    await ctx.answerCbQuery();
    const value = parseInt((ctx as any).match[0].replace('gender-', ''));

    if (isNaN(value) || value < 1 || value > 2) {
      ctx.wizard.selectStep(5);
      return 'Будь ласка, вибери стать зі списку:';
    }

    ctx.wizard.state['gender'] = value;
    ctx.wizard.next();

    const inlineKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Зменшення ваги', 'goal-1')],
      [Markup.button.callback('Утримання ваги', 'goal-2')],
      [Markup.button.callback("Збільшення М'язової Маси", 'goal-3')],
    ]);

    await ctx.replyWithHTML('Вибери свою мету:', {
      ...inlineKeyboard,
    });
  }

  @Action(/goal-.+/)
  @WizardStep(7)
  async onGoal(@Ctx() ctx: WizardContext) {
    await ctx.answerCbQuery();
    const value = parseInt((ctx as any).match[0].replace('goal-', ''));

    if (isNaN(value) || value < 1 || value > 3) {
      ctx.wizard.selectStep(6);
      return 'Будь ласка, вибери мету зі списку:';
    }

    ctx.wizard.state['goal'] = value;

    const { age, weight, height, activity, gender } = ctx.wizard.state as any;

    const { formattedResult, avgGoal } = formatResults(
      age,
      height,
      weight,
      activity,
      gender,
      value,
    );

    try {
      await this.settingsService.create(ctx.from.id.toString(), {});
    } catch (e) {
      console.error(e.message);
    }

    await ctx.replyWithHTML(formattedResult);
    await ctx.scene.enter(SCENE_ID.SETTINGS);
  }
}
