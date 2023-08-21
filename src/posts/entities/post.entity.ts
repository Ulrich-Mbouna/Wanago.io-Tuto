import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;
}
