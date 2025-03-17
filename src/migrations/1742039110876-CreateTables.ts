import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1742039110876 implements MigrationInterface {
    name = 'CreateTables1742039110876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "books" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "authors" character varying NOT NULL, "average_rating" double precision NOT NULL, "isbn" character varying NOT NULL, "isbn13" character varying(13) NOT NULL, "language_code" character varying NOT NULL, "num_pages" integer NOT NULL, "ratings_count" integer NOT NULL DEFAULT '0', "text_reviews_count" integer NOT NULL, "publication_date" TIMESTAMP NOT NULL, "publisher" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_54337dc30d9bb2c3fadebc69094" UNIQUE ("isbn"), CONSTRAINT "UQ_db6f2f33ce61a4709a4dcff2988" UNIQUE ("isbn13"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL DEFAULT '', "role" "public"."users_role_enum" NOT NULL DEFAULT '1', "bio" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "books"`);
    }

}
