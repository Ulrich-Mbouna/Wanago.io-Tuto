import {
  Resolver,
  Query,
  ResolveField,
  Mutation,
  Args,
  Context,
  Parent,
  Info,
} from '@nestjs/graphql';
import { PostsService } from '../posts.service';
import { Post } from '../models/post.model';
import { UseGuards } from '@nestjs/common';
import { GrapghqlJwtAuthGuard } from '../../authentication/grapghql-jwt-auth.guard';
import { CreatePostInput } from '../inputs/post.input';
import { RequestWithUser } from '../../authentication/requestWithUser.interface';
import { UserService } from '../../user/user.service';
import { User } from '../../user/models/user.model';
import PostsLoader from '../loaders/posts.loader';
import { GraphQLResolveInfo } from 'graphql/type';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UserService,
    private readonly postsLoader: PostsLoader,
  ) {}

  @Query(() => [Post])
  async posts(@Info() info: GraphQLResolveInfo) {
    const parsedInfo = parseResolveInfo(info) as ResolveTree;
    const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType,
    );
    const posts =
      'author' in simplifiedInfo
        ? await this.postsService.getPostsWithAuthors()
        : await this.postsService.getAllPosts();

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

  @ResolveField('author', () => User)
  async getAuthor(@Parent() post: Post) {
    const { authorId } = post;

    return this.postsLoader.batchAuthors.load(authorId);
  }
}
