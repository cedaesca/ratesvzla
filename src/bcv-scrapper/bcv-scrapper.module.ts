import { Module } from '@nestjs/common';
import { ScrapperModule } from 'src/scrapper/scrapper.module';
import { ScrapperService } from 'src/scrapper/scrapper.service';
import { BCVScrapperService } from './bcv-scrapper.service';

@Module({
  imports: [ScrapperModule],
  providers: [ScrapperService, BCVScrapperService],
})
export class BCVScrapperModule {}
