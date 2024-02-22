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

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
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
  ],
  controllers: [PostsController],
  providers: [PostsService, PostSearchService, PostResolver],
})
export class PostsModule {}
