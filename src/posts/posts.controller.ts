import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/requestWithUser.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() request: RequestWithUser,
  ) {
    return this.postsService.createPost(createPostDto, request.user);
  }

  @Get()
  findAll() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
