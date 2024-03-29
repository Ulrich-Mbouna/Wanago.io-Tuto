import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];

  @Field()
  content: string;

  @Field({ nullable: true })
  scheduledDate?: Date;
}
