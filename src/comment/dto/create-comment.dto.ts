import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectWithIdDto } from '../../utils/objectWithId.dto';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDto)
  post: ObjectWithIdDto;
}
