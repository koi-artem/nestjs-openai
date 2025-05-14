import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import axios from 'axios';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenaiService.name, { timestamp: true });
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async prompt(
    systemContent: string,
    userContent: string,
    locale: string = 'Ukrainian',
    temperature = 0,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant. Always respond in the language specified by the user. If instructed to use Ukrainian, all responses must be in Ukrainian.',
        },
        { role: 'system', content: systemContent },
        { role: 'user', content: `Answer strictly in ${locale} language.` },
        { role: 'user', content: userContent },
      ],
      model: 'gpt-4',
      temperature,
    });
    const {
      choices: [
        {
          message: { content },
        },
      ],
    } = response;

    if (content.startsWith('Error')) {
      throw new Error(content);
    }

    return content;
  }

  async transcript(url: string) {
    const filename = `${uuid()}.ogg`;
    const fileResponse = await axios({
      url,
      method: 'get',
      responseType: 'stream',
    });

    await new Promise((resolve, reject) => {
      const stream = fileResponse.data.pipe(fs.createWriteStream(filename));
      stream.on('finish', () => resolve(null));
      stream.on('error', () => reject('Stream error'));
    });

    const audio = fs.createReadStream(filename);
    const { text } = await this.openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
    });
    await fs.promises.unlink(filename);

    return text;
  }
}
