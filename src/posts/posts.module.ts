import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { SearchModule } from '../search/search.module';
import { PostSearchService } from './postSearch.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    CacheModule.register({
      ttl: 50000,
      max: 100,
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostSearchService],
})
export class PostsModule {}
