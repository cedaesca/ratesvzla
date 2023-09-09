import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import {
  GetMultipleTextContentsOptions,
  GetTextContentOptions,
} from './scrapper.types';

@Injectable()
export class ScrapperService {
  // 2 minutes
  private readonly pageTimeout = 2 * 60 * 1000;

  private readonly viewportResolution = {
    width: 1080,
    height: 1024,
  };

  private browser: Browser;
  private configuratedPage: Page;

  public async getTextContent(options: GetTextContentOptions): Promise<string> {
    try {
      await this.goTo(options.url);

      const element = await this.configuratedPage.waitForSelector(
        options.selector,
      );

      const value = await element.evaluate((el) => el.textContent);

      return value;
    } catch (error) {
      throw new Error(
        `Failed to fetch text content from ${options.url} using selector ${options.selector}: ${error.message}`,
      );
    } finally {
      await this.cleanup();
    }
  }

  public async getMultipleTextContents(
    options: GetMultipleTextContentsOptions,
  ): Promise<object> {
    try {
      await this.goTo(options.url);
      const resultsObject = {};

      for (const [selectorKey, selector] of Object.entries(options.selectors)) {
        try {
          const element = await this.configuratedPage.waitForSelector(selector);

          resultsObject[selectorKey] = await element.evaluate(
            (el) => el.textContent,
          );
        } catch (error) {
          throw new Error(
            `Failed to fetch content using selector "${selectorKey}" from ${options.url}. Error: ${error.message}`,
          );
        }
      }

      return resultsObject;
    } finally {
      await this.cleanup();
    }
  }

  private async goTo(url: string): Promise<void> {
    if (!this.browser) {
      await this.init();
    }

    await this.configuratedPage.goto(url);
  }

  private async cleanup(): Promise<void> {
    if (this.configuratedPage) {
      await this.configuratedPage.close();

      this.configuratedPage = null;
    }

    if (this.browser) {
      await this.browser.close();

      this.browser = null;
    }
  }

  private async init(): Promise<void> {
    this.browser = await puppeteer.launch();
    this.configuratedPage = await this.browser.newPage();
    this.configuratedPage.setDefaultNavigationTimeout(this.pageTimeout);
    await this.configuratedPage.setViewport(this.viewportResolution);
  }
}
