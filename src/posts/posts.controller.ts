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
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/requestWithUser.interface';
import { PaginationParams } from '../utils/paginationParams';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';
import { GET_POSTS_CACHE_KEY } from './caches/postCacheKey.constant';
import { HttpCacheInterceptor } from './caches/httpCache.interceptor.js';
import JwtTwoFactorGuard from '../authentication/jwt-two-factor.guard';
import { FindOneParams } from '../utils/findOneParams';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostByd(+id);
  }

  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @Put(':id')
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostDto,
  ) {
    return this.postsService.updatePost(+id, post);
  }

  @Delete(':id')
  async deletePost(@Param() id: FindOneParams) {
    return this.postsService.deletePost(+id);
  }

  // @UseGuards(JwtTwoFactorGuard)
  // @Post()
  // async createPost(
  //   @Body() createPostDto: CreatePostDto,
  //   @Req() request: RequestWithUser,
  // ) {
  //   return this.postsService.createPost(createPostDto, request.user);
  // }
  //
  // @UseInterceptors(HttpCacheInterceptor)
  // @CacheKey(GET_POSTS_CACHE_KEY)
  // @CacheTTL(120)
  // @Get()
  // async getAllPost(
  //   @Query('search') search: string,
  //   @Query() { offset, limit }: PaginationParams,
  // ) {
  //   if (search) {
  //     return this.postsService.searchForPosts(search, offset, limit);
  //   }
  //   return this.postsService.getAllPosts(offset, limit);
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postsService.getPostById(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.updatePost(+id, updatePostDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postsService.deletePost(+id);
  // }
}
