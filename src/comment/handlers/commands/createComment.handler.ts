import { CreateCommentCommand } from '../../commands/createComment.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand) {
    const newComment = this.commentRepository.create({
      ...command.comment,
      author: command.author,
    });

    await this.commentRepository.save(newComment);

    return newComment;
  }
}
