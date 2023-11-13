import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ObjectWithIdDto } from '../../utils/objectWithId.dto';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDto)
  category: ObjectWithIdDto;
}
