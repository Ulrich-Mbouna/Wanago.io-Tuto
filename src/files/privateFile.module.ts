import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateFilesService } from './privateFiles.service';
import { PrivateFile } from '../privateFiles/privateFile.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [PrivateFilesService],
  exports: [PrivateFilesService],
  imports: [ConfigModule, TypeOrmModule.forFeature([PrivateFile])],
})
export class PrivateFileModule {}
