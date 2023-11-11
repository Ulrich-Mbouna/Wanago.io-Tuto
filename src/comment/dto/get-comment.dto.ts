import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommentDto {
  @Type(() => Number)
  @IsOptional()
  postId?: number;
}
