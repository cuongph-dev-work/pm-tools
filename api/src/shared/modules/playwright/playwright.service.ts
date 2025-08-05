import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

@Injectable()
export class PlaywrightService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PlaywrightService.name);
  private browser: Browser;

  async onModuleInit() {
    this.browser = await chromium.launch({ headless: false });
    this.logger.log('▶️ Playwright browser launched');
  }

  async onModuleDestroy() {
    await this.browser.close();
    this.logger.log('⏹️ Playwright browser closed');
  }

  /** Tạo context + page mới */
  async newPage(): Promise<Page> {
    const context: BrowserContext = await this.browser.newContext();
    const page: Page = await context.newPage();
    return page;
  }
}
