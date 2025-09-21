import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserIdToSerial1700000000001 implements MigrationInterface {
  name = 'ChangeUserIdToSerial1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero eliminar la tabla users existente
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    
    // Crear la tabla users con SERIAL ID
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "firstName" character varying(100) NOT NULL,
        "lastName" character varying(100) NOT NULL,
        "email" character varying(255) NOT NULL,
        "phone" character varying(255),
        "password" character varying(255) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "isEmailVerified" boolean NOT NULL DEFAULT false,
        "balance" numeric(15,2) NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Crear índice único para email
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users" CASCADE`);
  }
}
