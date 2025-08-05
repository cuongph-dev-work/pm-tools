import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightService } from '@shared/modules/playwright/playwright.service';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';
import pixelmatch from 'pixelmatch';
import { Page } from 'playwright';
import { PNG } from 'pngjs';
import { firstValueFrom } from 'rxjs';
import sharp from 'sharp';
import { ssim } from 'ssim.js';
import { CreateLayoutCheckerDto } from './dtos/create.dto';

@Injectable()
export class LayoutCheckerService {
  private openai: OpenAI;
  private promptTemplate: string;
  private readonly logger = new Logger(LayoutCheckerService.name);
  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly httpService: HttpService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const promptPath = path.join(__dirname, 'prompt.md');
    this.promptTemplate = fs.readFileSync(promptPath, 'utf-8');
  }

  private async getFrameViewport(fileKey: string, frameNodeId: string, figmaToken: string) {
    const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${frameNodeId}`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          'X-Figma-Token': figmaToken,
        },
      }),
    );

    const nodeId = frameNodeId.replace('-', ':');
    const document = response.data?.nodes?.[nodeId]?.document?.absoluteBoundingBox;
    if (!document) {
      throw new Error('Frame not found');
    }

    return {
      width: document.width,
      height: document.height,
    };
  }

  // from figma url, extract file key and frame node id
  // https://www.figma.com/design/TFXcgvmT6q9KEY4vWYg8XE/Sample-Project---Localhost--Copy-?node-id=1-921&t=ZN1glN7MuguetGcm-4
  // return fileKey (TFXcgvmT6q9KEY4vWYg8XE) and frameNodeId (1-921)
  private async extractFigmaInfo(figmaUrl: string) {
    const fileKey = figmaUrl.split('/').pop()?.split('?')[0];
    const frameNodeId = figmaUrl.split('?')[0].split('/').pop()?.split('?')[0];
    return { fileKey, frameNodeId };
  }

  private async exportFrameImage(fileKey: string, frameNodeId: string, figmaToken: string) {
    const url = `https://api.figma.com/v1/images/${fileKey}` + `?ids=${frameNodeId}&format=png&scale=1`;
    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          'X-Figma-Token': figmaToken,
        },
      }),
    );
    const imgUrl = response.data.images[frameNodeId.replace('-', ':')];

    const res2 = await firstValueFrom(this.httpService.get(imgUrl, { responseType: 'arraybuffer' }));
    return res2.data;
  }

  async getWebsiteImage(url: string, viewport: { width: number; height: number }) {
    const page: Page = await this.playwrightService.newPage();
    await page.goto(url);
    await page.setViewportSize(viewport);
    const screenshot = await page.screenshot();
    await page.close();
    return screenshot;
  }

  // compare two images
  async compareImages(bufA: Buffer, bufB: Buffer, threshold = 0.1) {
    const imgA = PNG.sync.read(bufA);
    const imgB = PNG.sync.read(bufB);

    if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
      throw new Error('Kích thước hai ảnh không khớp');
    }
    const { width, height } = imgA;

    const diffImg = new PNG({ width, height });
    const diffCount = pixelmatch(imgA.data, imgB.data, diffImg.data, imgA.width, imgA.height, { threshold });
    const totalPixel = width * height;

    // Tính tỉ lệ phần trăm khác biệt
    const diffRatio = diffCount / totalPixel;

    // 8. Encode lại PNG
    const markedBuffer = PNG.sync.write(diffImg);

    // 4. Xuất diff thành buffer PNG
    return { diffCount, diffBuffer: markedBuffer, diffRatio };
  }

  compareImagesWithPrompt = async (bufA: Buffer, bufB: Buffer, diffRatio: number, width: number, height: number) => {
    // SSIM (grayscale) requires Uint8ClampedArray
    const grayBufA = await sharp(bufA).resize(width, height).grayscale().raw().toBuffer();
    const grayBufB = await sharp(bufB).resize(width, height).grayscale().raw().toBuffer();
    const gray1 = new Uint8ClampedArray(grayBufA);
    const gray2 = new Uint8ClampedArray(grayBufB);
    const { mssim } = ssim({ data: gray1, width, height }, { data: gray2, width, height });

    // Fallback: dùng SSIM làm giá trị semantic similarity
    const semanticSim = mssim;
    // Build prompt: có thể loại bỏ placeholder CLIP nếu prompt.md đã cập nhật
    const prompt = this.promptTemplate.replace(/\$\{SEMANTIC_SIM\}/g, semanticSim.toFixed(3));

    const chatRes = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${bufA.toString('base64')}`,
              },
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${bufB.toString('base64')}`,
              },
            },
          ],
        },
      ],
    });
    const analysis = chatRes.choices[0].message.content || '';
    // Chuyển sang đối tượng JSON
    let result: { diff: string; matchRate: number };
    try {
      result = JSON.parse(analysis);
    } catch (error) {
      result = {
        diff: analysis.trim() || 'Không có dữ liệu.',
        matchRate: diffRatio,
      };
    }
    return result;
  };

  async checkLayout(body: CreateLayoutCheckerDto) {
    const { figmaUrl, figmaToken, websiteUrl } = body;
    const { fileKey, frameNodeId } = await this.extractFigmaInfo(figmaUrl);
    if (!fileKey || !frameNodeId) {
      throw new Error('Invalid figma url');
    }

    const viewport = await this.getFrameViewport(fileKey, frameNodeId, figmaToken);
    const bufA = await this.exportFrameImage(fileKey, frameNodeId, figmaToken);
    const bufB = await this.getWebsiteImage(websiteUrl, viewport);

    // 2. Compare
    const result = await this.compareImages(bufA, bufB);
    // save diff image to file
    return result;
  }
}
