import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Delete,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { FindOneParams } from '../utils/findOneParams';
import { FileInterceptor } from '@nestjs/platform-express';

import { Express } from 'express';
import { RequestWithUser } from '../authentication/requestWithUser.interface';
import { createReadStream } from 'fs';
import { ReadStream } from 'typeorm/browser/platform/BrowserPlatformTools';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthenticationGuard)
  async addAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Delete('avatar')
  @UseGuards(JwtAuthenticationGuard)
  async deleteAvatar(@Req() req: RequestWithUser) {
    const id = req.user.id;
    return this.userService.deleteAvatar(id);
  }

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(
    @Req() request: RequestWithUser,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.userService.addPrivateFile(
      request.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  async getAllPrivatesFiles(@Req() request: RequestWithUser) {
    return this.userService.getAllPrivateFiles(request.user.id);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async getOneUser(@Param() { id }: FindOneParams) {
    return this.userService.getById(+id);
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() request: RequestWithUser,
  ) {
    const file = await this.userService.getPrivateFile(
      request.user.id,
      Number(id),
    );

    return new StreamableFile(file.stream);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
