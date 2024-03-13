import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { SearchModule } from '../search/search.module';
import { PostSearchService } from './postSearch.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostResolver } from './resolvers/post.resolver';
import { UserModule } from '../user/user.module';
import PostsLoader from './loaders/posts.loader';
import { PostSubscriptionResolver } from './resolvers/post-subscription.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UserModule,
    SearchModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostSearchService,
    PostResolver,
    PostsLoader,
    PostSubscriptionResolver,
  ],
})
export class PostsModule {}
