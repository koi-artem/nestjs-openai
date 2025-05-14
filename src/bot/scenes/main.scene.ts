import { Scene, SceneEnter, Ctx } from "nestjs-telegraf";
import { SCENE_ID } from "../../app.constants";
import { Context } from "../../interfaces/context.interface";
import { Markup } from "telegraf";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ENDPOINTS } from "../bot.endpoints";

@Scene(SCENE_ID.MAIN)
@Injectable()
export class MainScene {
  private readonly logger = new Logger(MainScene.name, { timestamp: true });
  constructor(private readonly configService: ConfigService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    try {
      await ctx.reply(
        "Main menu",
        Markup.keyboard([
          [Markup.button.text(ENDPOINTS.TODAY)],
          [
            Markup.button.text(ENDPOINTS.SETTINGS),
            Markup.button.text(ENDPOINTS.FEEDBACK),
          ],
        ]).resize()
      );
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }
}
