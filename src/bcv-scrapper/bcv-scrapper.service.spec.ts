import { Test, TestingModule } from '@nestjs/testing';
import { BCVScrapperService } from './bcv-scrapper.service';
import { ConfigService } from '@nestjs/config';
import { ScrapperService } from '../scrapper/scrapper.service';

// Mocked data for our tests
const mockBCVUrl = 'http://bcv.example.com';
const mockScrappedData = {
  usd: '1.2',
  eur: '1.3',
  cny: '1.4',
  try: '1.5',
  rub: '1.6',
};

describe('BCVScrapperService', () => {
  let service: BCVScrapperService;
  let mockScrapperService: Partial<ScrapperService>;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockScrapperService = {
      getMultipleTextContents: jest.fn().mockResolvedValue(mockScrappedData),
    };

    mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue(mockBCVUrl),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BCVScrapperService,
        {
          provide: ScrapperService,
          useValue: mockScrapperService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BCVScrapperService>(BCVScrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllExchangeRates', () => {
    it('should return exchange rates', async () => {
      const rates = await service.getAllExchangeRates();
      expect(rates).toEqual(mockScrappedData);
    });

    it('should call ScrapperService with correct parameters', async () => {
      await service.getAllExchangeRates();

      const expectedSelectors = {
        usd: '#dolar > div > div > .centrado > strong',
        eur: '#euro > div > div > .centrado > strong',
        cny: '#yuan > div > div > .centrado > strong',
        try: '#lira > div > div > .centrado > strong',
        rub: '#rublo > div > div > .centrado > strong',
      };

      expect(mockScrapperService.getMultipleTextContents).toHaveBeenCalledWith({
        url: mockBCVUrl,
        selectors: expectedSelectors,
      });
    });
  });
});
