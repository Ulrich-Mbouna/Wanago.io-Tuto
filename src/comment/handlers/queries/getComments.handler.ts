import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCommentsQuery } from '../../queries/getComments.query';
import { Comment } from '../../entities/comment.entity';

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async execute(query: GetCommentsQuery) {
    if (query.postId) {
      return this.commentRepository.findBy({
        post: {
          id: query.postId,
        },
      });
    }

    return this.commentRepository.find();
  }
}
