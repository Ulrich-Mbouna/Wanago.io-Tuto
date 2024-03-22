import { Module } from '@nestjs/common';
import { OptimizeService } from './optimize.service';
import { OptimizeController } from './optimize.controller';
import { BullModule } from '@nestjs/bull';
import { ImageProcessor } from './processors/optimize.processor';
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image',
    }),
  ],
  controllers: [OptimizeController],
  providers: [OptimizeService, ImageProcessor],
})
export class OptimizeModule {}
