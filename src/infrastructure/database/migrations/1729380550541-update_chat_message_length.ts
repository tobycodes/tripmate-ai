import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateChatMessageLength1729380550541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_message" ALTER COLUMN "message" TYPE varchar(3000)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_message" ALTER COLUMN "message" TYPE varchar(1000)`);
  }
}
