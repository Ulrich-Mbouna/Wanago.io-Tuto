import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './entities/post.entity';

@Injectable()
export class PostSearchService {
  index = 'posts';

  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticSearchService.index<PostSearchBody>({
      index: this.index,
      document: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  async search(text: string) {
    const { hits } = await this.elasticSearchService.search<PostSearchBody>({
      index: this.index,
      query: {
        multi_match: {
          query: text,
          fields: ['title', 'content'],
        },
      },
    });

    return hits.hits.map((item) => item._source);
  }

  async remove(postId: number) {
    return await this.elasticSearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: postId,
        },
      },
    });
  }
}
