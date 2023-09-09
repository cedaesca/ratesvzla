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
    await this.goTo(options.url);

    const element = await this.configuratedPage.waitForSelector(
      options.selector,
    );

    const value = await element.evaluate((el) => el.textContent);

    this.browser.close();

    return value;
  }

  public async getMultipleTextContents(
    options: GetMultipleTextContentsOptions,
  ): Promise<object> {
    const resultsObject = {};
    const selectorsKeys = Object.keys(options.selectors);

    await this.goTo(options.url);

    for (const selectorKey of selectorsKeys) {
      const element = await this.configuratedPage.waitForSelector(
        options.selectors[selectorKey],
      );

      resultsObject[selectorKey] = await element.evaluate(
        (el) => el.textContent,
      );
    }

    this.browser.close();

    return resultsObject;
  }

  private async goTo(url: string): Promise<Page> {
    await this.init();
    await this.configuratedPage.goto(url);

    return this.configuratedPage;
  }

  private async init(): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(this.pageTimeout);

    await page.setViewport({
      width: this.viewportResolution.width,
      height: this.viewportResolution.height,
    });

    this.browser = browser;
    this.configuratedPage = page;
  }
}
