import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchemaForAllEntities1729982071286 implements MigrationInterface {
  name = 'CreateSchemaForAllEntities1729982071286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "app"."chat_message_role_enum" AS ENUM('user', 'assistant')`);
    await queryRunner.query(
      `CREATE TABLE "app"."chat_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying(3000) NOT NULL, "role" "app"."chat_message_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid, CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "isApproved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "app"."email_status_enum" AS ENUM('pending', 'sent', 'failed')`);
    await queryRunner.query(
      `CREATE TABLE "app"."email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" character varying, "to" character varying NOT NULL, "subject" character varying NOT NULL, "status" "app"."email_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "metadata" jsonb, CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "app"."access_request_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."access_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "requestedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "app"."access_request_status_enum" NOT NULL DEFAULT 'pending', "approvedAt" TIMESTAMP, "rejectedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a543250cab0b6d2eb3a85593d93" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."chat_message" ADD CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3" FOREIGN KEY ("userId") REFERENCES "app"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "app"."chat_message" DROP CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3"`);
    await queryRunner.query(`DROP TABLE "app"."access_request"`);
    await queryRunner.query(`DROP TYPE "app"."access_request_status_enum"`);
    await queryRunner.query(`DROP TABLE "app"."email"`);
    await queryRunner.query(`DROP TYPE "app"."email_status_enum"`);
    await queryRunner.query(`DROP TABLE "app"."user"`);
    await queryRunner.query(`DROP TABLE "app"."chat_message"`);
    await queryRunner.query(`DROP TYPE "app"."chat_message_role_enum"`);
  }
}
