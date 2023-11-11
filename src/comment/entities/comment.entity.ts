import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Post from '../../posts/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(() => Post, (post: Post) => post.comments, {
    eager: true,
  })
  public post: Relation<Post>;

  @ManyToOne(() => User, (author: User) => author.posts, {
    eager: true,
  })
  public author: User;
}
