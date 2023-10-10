import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './publicFile.entity';
import { PrivateFile } from '../privateFiles/privateFile.entity';

@Module({
  providers: [FilesService],
  exports: [FilesService],
  imports: [ConfigModule, TypeOrmModule.forFeature([PublicFile])],
})
export class FilesModule {}
