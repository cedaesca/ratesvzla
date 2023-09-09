import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScrapperService } from '../scrapper/scrapper.service';
import { ScrapperSelector } from '../scrapper/scrapper.types';

@Injectable()
export class BCVScrapperService {
  private readonly currencySelectors = {
    usd: 'dolar',
    eur: 'euro',
    cny: 'yuan',
    try: 'lira',
    rub: 'rublo',
  };

  private readonly bcvUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly scrapperService: ScrapperService,
  ) {
    this.bcvUrl = this.configService.getOrThrow<string>('BCV_URL');
  }

  public async getAllExchangeRates() {
    const selectors = await this.buildCurrencySelectors();

    const rates = await this.scrapperService.getMultipleTextContents({
      url: this.bcvUrl,
      selectors,
    });

    return rates;
  }

  private async buildCurrencySelectors(): Promise<ScrapperSelector> {
    const currencyCodes = Object.keys(this.currencySelectors);
    const scrapperSelectors: ScrapperSelector = {};

    for (const currencyCode of currencyCodes) {
      scrapperSelectors[currencyCode] = this.getSelectorString(currencyCode);
    }

    return scrapperSelectors;
  }

  private getSelectorString(currencyCode: string): string {
    return `#${this.currencySelectors[currencyCode]} > div > div > .centrado > strong`;
  }
}
