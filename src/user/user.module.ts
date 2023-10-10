import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from '../files/files.service';
import { FilesModule } from '../files/files.module';
import { PrivateFilesService } from '../files/privateFiles.service';
import { PrivateFileModule } from '../files/privateFile.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilesModule, PrivateFileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
