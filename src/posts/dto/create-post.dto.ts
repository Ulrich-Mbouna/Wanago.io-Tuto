import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];

  @IsString()
  title: string;

  @IsString()
  content: string;

  categoryIds?: number[];
}
