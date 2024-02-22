import {
  Resolver,
  Query,
  ResolveField,
  Mutation,
  Args,
  Context,
} from '@nestjs/graphql';
import { PostsService } from '../posts.service';
import { Post } from '../models/post.model';
import { UseGuards } from '@nestjs/common';
import { GrapghqlJwtAuthGuard } from '../../authentication/grapghql-jwt-auth.guard';
import { CreatePostInput } from '../inputs/post.input';
import { RequestWithUser } from '../../authentication/requestWithUser.interface';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getAllPosts();

    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GrapghqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    return await this.postsService.createPost(
      createPostInput,
      context.req.user,
    );
  }
}
