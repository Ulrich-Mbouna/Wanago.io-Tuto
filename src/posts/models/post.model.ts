import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];

  @Field()
  content: string;

  @Field(() => Int)
  authorId: number;

  @Field()
  author: User;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  scheduledDate?: Date;
}
