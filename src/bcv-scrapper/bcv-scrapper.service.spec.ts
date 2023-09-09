import { Test, TestingModule } from '@nestjs/testing';
import { BcvScrapperService } from './bcv-scrapper.service';

describe('BcvScrapperService', () => {
  let service: BcvScrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcvScrapperService],
    }).compile();

    service = module.get<BcvScrapperService>(BcvScrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
