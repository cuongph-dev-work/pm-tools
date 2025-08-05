import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeminiService {
  constructor(private readonly httpService: HttpService) {}

  async resolveCaptcha(imageURL: string, apiKey: string) {
    const gemini = new GoogleGenerativeAI(apiKey);
    const response = await firstValueFrom(this.httpService.get(imageURL, { responseType: 'arraybuffer' }));

    const base64 = Buffer.from(response.data).toString('base64');
    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Extract all readable text from this image, return the text in the image, only return the text, no explanation',
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64,
              },
            },
          ],
        },
      ],
    });
    return result.response.text();
  }
}
