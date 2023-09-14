import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostNotFoundException } from './exception/postNotFound.exception';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createPost(post: CreatePostDto, user: User) {
    const newPost = this.postRepository.create({
      ...post,
      author: user,
    });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async getAllPosts() {
    return this.postRepository.find({ relations: ['author'] });
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
      return updatePost;
    }
    throw new PostNotFoundException(id);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
