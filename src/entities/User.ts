import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { Address } from "./Address";

enum Ethnicity {
  "branco",
  "pardo",
  "negro",
  "amarelo",
  "indigena",
  "outro",
}

@Entity("users")
class User {
  @PrimaryColumn()
  readonly id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  telephone!: string;

  @Column()
  birthdate!: Date;

  @Column()
  weight!: number;

  @Column()
  ethnicity!: Ethnicity;

  @OneToMany(type => Address, address => address.user)
  address!: Address[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { User };
