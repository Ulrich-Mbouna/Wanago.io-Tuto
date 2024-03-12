import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  RelationOptions,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Address } from '../../address/entities/address.entity';
import Post from '../../posts/entities/post.entity';
import { PublicFile } from '../../files/publicFile.entity';
import { PrivateFile } from '../../privateFiles/privateFile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  public id?: number;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Expose()
  public name: string;

  @Column()
  public password: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Expose()
  public address: Address;

  @Column({
    nullable: true,
  })
  public currentHashedRefreshToken?: string;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts?: Post[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files: PrivateFile[];

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;
}
