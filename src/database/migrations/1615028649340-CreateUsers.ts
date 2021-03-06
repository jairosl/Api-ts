import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1615028649340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "telephone",
            type: "varchar",
          },
          {
            name: "email",
            type: "varchar",
          },
          {
            name: "birthdate",
            type: "date",
          },
          {
            name: "weight",
            type: "numeric",
          },
          {
            name: "ethnicity",
            type: "varchar",
            enum: ["branco", "pardo", "negro", "amarelo", "indigena", "outro"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase("users");
  }
}
