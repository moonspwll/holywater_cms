import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1741784678926 implements MigrationInterface {
    name = 'CreateTables1741784678926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "average_rating" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "average_rating" integer NOT NULL`);
    }

}
