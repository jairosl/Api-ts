import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

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

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { User };
