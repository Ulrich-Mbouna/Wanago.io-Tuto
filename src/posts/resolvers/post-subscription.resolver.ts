import { Resolver, Subscription } from '@nestjs/graphql';
import { Post } from '../models/post.model';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '../../pubSub/pubSub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';

const POST_ADDED_EVENT = 'postAdded';

@Resolver((of) => Post)
export class PostSubscriptionResolver {
  constructor(@Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  @Subscription((resolvers) => Post)
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }
}
