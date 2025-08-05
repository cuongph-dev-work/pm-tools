import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenaiService {
  constructor(private readonly httpService: HttpService) {}

  async resolveCaptcha(imageURL: string, apiKey: string) {
    const openai = new OpenAI({ apiKey });
    const response = await firstValueFrom(this.httpService.get(imageURL, { responseType: 'arraybuffer' }));
    const base64 = Buffer.from(response.data).toString('base64');
    const result = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Extract all readable text from this image, return the text in the image, only return the text, no explanation. Image: data:image/jpeg;base64,${base64}`,
        },
      ],
    });
    return result.choices[0].message.content?.trim();
  }
}
