import {
  Resolver,
  Query,
  ResolveField,
  Mutation,
  Args,
  Context,
  Parent,
  Info,
  Subscription,
} from '@nestjs/graphql';
import { PostsService } from '../posts.service';
import { Post } from '../models/post.model';
import { Inject, UseGuards } from '@nestjs/common';
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
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../../pubSub/pubSub.module';

const POST_ADDED_EVENT = 'postAdded';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsLoader: PostsLoader,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
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
    console.log({ createPostInput });
    const newPost = await this.postsService.createPost(
      createPostInput,
      context.req.user,
    );

    await this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });

    return newPost;
  }

  // @ResolveField('author', () => User)
  // async getAuthor(@Parent() post: Post) {
  //   const { authorId } = post;
  //
  //   return this.postsLoader.batchAuthors.load(authorId);
  // }

  @Subscription((returns) => Post, { name: 'newPostAdded' })
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }
}
