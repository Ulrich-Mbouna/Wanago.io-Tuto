import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { OptimizeService } from './optimize.service';
import { CreateOptimizeDto } from './dto/create-optimize.dto';
import { UpdateOptimizeDto } from './dto/update-optimize.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('optimize')
export class OptimizeController {
  constructor(
    private readonly optimizeService: OptimizeService,
    @InjectQueue('image') private readonly imageQueue: Queue,
  ) {}

  @Post('image')
  @UseInterceptors(AnyFilesInterceptor)
  async processImage(@UploadedFile() files: Express.Multer.File[]) {
    const job = await this.imageQueue.add('optimize', {
      files,
    });

    return {
      jobId: job.id,
    };
  }

  @Get('image/:id')
  async getJobResult(@Res() response: Response, @Param('id') id: string) {
    const job = await this.imageQueue.getJob(id);

    if (!job) {
      return response.sendStatus(HttpStatus.NOT_FOUND);
    }

    const isComplete = await job.isCompleted();

    if (!isComplete) {
      return response.json({
        status: HttpStatus.ACCEPTED,
        data: job.progress(),
      });
    }

    const result = Buffer.from(job.returnvalue);

    const stream = Readable.from(result);

    stream.pipe(response);
  }
}
