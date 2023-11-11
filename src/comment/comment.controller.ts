import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/requestWithUser.interface';
import { CreateCommentCommand } from './commands/createComment.command';
import { GetCommentDto } from './dto/get-comment.dto';
import { GetCommentsQuery } from './queries/getComments.query';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() comment: CreateCommentDto, @Req() req: RequestWithUser) {
    return this.commandBus.execute(new CreateCommentCommand(comment, req.user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
