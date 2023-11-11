import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCommentHandler } from './handlers/commands/createComment.handler';
import { Comment } from './entities/comment.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCommentsQuery } from './queries/getComments.query';
import { GetCommentsHandler } from './handlers/queries/getComments.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  controllers: [CommentController],
  providers: [CreateCommentHandler, GetCommentsHandler],
})
export class CommentModule {}
