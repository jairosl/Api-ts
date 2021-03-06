/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";

@Entity("address")
class Address {
  @PrimaryColumn()
  readonly id!: string;

  @Column()
  street!: string;

  @Column()
  district!: string;

  @Column()
  number!: number;

  @Column()
  complement!: string;

  @Column()
  cep!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  user_id!: string;

  @ManyToOne(() => User, (user) => user.address)
  @JoinColumn({ name: "user_id" })
  user!: User;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Address };
