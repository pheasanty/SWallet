import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTokensTable1700000000005 implements MigrationInterface {
  name = 'CreateTokensTable1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tokens',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'symbol',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'contract_address',
            type: 'varchar',
            length: '255',
            isNullable: true, // Para tokens nativos como BTC, ETH
          },
          {
            name: 'network',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'decimals',
            type: 'integer',
            default: 18,
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'logo_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear índices únicos
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_tokens_symbol_network" ON "tokens" ("symbol", "network")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_tokens_network" ON "tokens" ("network")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tokens');
  }
}
