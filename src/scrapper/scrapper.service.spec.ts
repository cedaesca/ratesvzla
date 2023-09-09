import { Test, TestingModule } from '@nestjs/testing';
import { ScrapperService } from './scrapper.service';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ScrapperService', () => {
  let service: ScrapperService;

  const mockPage = {
    goto: jest.fn(),
    waitForSelector: jest.fn().mockResolvedValue({
      evaluate: jest.fn().mockResolvedValue('mockedValue'),
    }),
    setDefaultNavigationTimeout: jest.fn(),
    setViewport: jest.fn(),
    close: jest.fn(),
  };

  const mockBrowser = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn(),
  };

  (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapperService],
    }).compile();

    service = module.get<ScrapperService>(ScrapperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTextContent', () => {
    it('should retrieve text content from a given URL and selector', async () => {
      const mockUrl = 'https://example.com';
      const mockSelector = '.example-class';

      const result = await service.getTextContent({
        url: mockUrl,
        selector: mockSelector,
      });

      expect(result).toBe('mockedValue');
    });

    it('should throw a custom error if Puppeteer fails while scrapping', async () => {
      const mockErrorMessage = 'Random Puppeteer error';
      mockPage.goto.mockRejectedValueOnce(new Error(mockErrorMessage));

      await expect(
        service.getTextContent({
          url: 'https://example.com',
          selector: '.example',
        }),
      ).rejects.toThrow(
        `Failed to fetch text content from https://example.com using selector .example: ${mockErrorMessage}`,
      );
    });
  });

  describe('getMultipleTextContents', () => {
    it('should retrieve multiple text contents from given URL and selectors', async () => {
      const mockUrl = 'https://example.com';

      const mockSelectors = {
        example1: '.example-class1',
        example2: '.example-class2',
      };

      const result = await service.getMultipleTextContents({
        url: mockUrl,
        selectors: mockSelectors,
      });

      expect(result).toEqual({
        example1: 'mockedValue',
        example2: 'mockedValue',
      });
    });

    it('should throw a custom error if Puppeteer fails while scrapping', async () => {
      const mockErrorMessage = 'Random Puppeteer error for selector';

      mockPage.waitForSelector.mockRejectedValueOnce(
        new Error(mockErrorMessage),
      );

      await expect(
        service.getMultipleTextContents({
          url: 'https://example.com',
          selectors: { example1: '.example-class1' },
        }),
      ).rejects.toThrow(
        `Failed to fetch content using selector "example1" from https://example.com. Error: ${mockErrorMessage}`,
      );
    });
  });
});
