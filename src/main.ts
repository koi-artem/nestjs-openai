import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';
import { BOT_NAME } from './app.constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomTelegrafException } from './bot/filters/customTelegrafException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomTelegrafException());
  app.enableCors();
  const bot = app.get(getBotToken(BOT_NAME));
  app.use(bot.webhookCallback('/bot'));

  const config = new DocumentBuilder()
    .setTitle('Calories tracker')
    .setDescription('Calories tracker API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
