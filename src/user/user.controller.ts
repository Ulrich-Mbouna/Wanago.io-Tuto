import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import { FindOneParams } from "../utils/findOneParams";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async getOneUser(@Param() { id }: FindOneParams) {
    console.log({id});
    return this.userService.getById(+id);
  }
}
