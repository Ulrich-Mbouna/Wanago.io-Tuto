import { IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindOneParams {
  @IsNumberString()
  @Transform(({ value }) => Number(value))
  id: string;
}
