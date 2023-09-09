import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScrapperModule } from './scrapper/scrapper.module';
import { BCVScrapperModule } from './bcv-scrapper/bcv-scrapper.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScrapperModule,
    BCVScrapperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
