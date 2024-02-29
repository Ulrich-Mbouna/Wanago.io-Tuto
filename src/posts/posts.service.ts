import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { PostNotFoundException } from './exception/postNotFound.exception';
import { User } from '../user/entities/user.entity';
import { PostSearchService } from './postSearch.service';
import { FindOneParams } from '../utils/findOneParams';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GET_POSTS_CACHE_KEY } from './caches/postCacheKey.constant';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private postSearchService: PostSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async clearCache() {
    const keys = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }
  async createPost(post: CreatePostDto, user: User) {
    const newPost = this.postRepository.create({
      ...post,
      author: user,
    });
    await this.postRepository.save(newPost);
    await this.postSearchService.indexPost(newPost);
    await this.clearCache();
    return newPost;
  }

  async getAllPosts(
    offset?: number,
    limit?: number,
    startId?: number,
    options?: FindManyOptions<Post>,
  ) {
    console.log('Get All');
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;

    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postRepository.count();
    }

    const [items, count] = await this.postRepository.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: offset,
      ...options,
    });

    return {
      count: startId ? separateCount : count,
      items,
    };
  }
  async getPostsWithParagraph(paragraph: string) {
    return this.postRepository.query(
      'SELECT * FROM post WHERE $1= ANY(paragraphs)',
      [paragraph],
    );
  }

  async getPostById(id: number) {
    const post = this.postRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    const updatePost = await this.getPostById(id);
    if (updatePost) {
      await this.clearCache();
      return updatePost;
    }
    throw new PostNotFoundException(id);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }

    await this.postSearchService.remove(id);
    await this.clearCache();
  }

  async searchForPosts(text: string, offset?: number, limit?: number) {
    const results = await this.postSearchService.search(text);
    const ids = results.map((result) => result.id);

    if (!ids.length) {
      return [];
    }

    return this.postRepository.find({
      where: { id: In(ids) },
    });
  }

  async getPostsWithAuthors(offset?: number, limit?: number, startId?: number) {
    console.log('With Author');
    return this.getAllPosts(offset, limit, startId, {
      relations: {
        author: true,
      },
    });
  }
}
