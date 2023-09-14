import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  @OneToOne(() => User, (user: User) => user.address)
  user?: Relation<User>;
}
