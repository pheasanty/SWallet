import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTransactionsTable1700000000003 implements MigrationInterface {
  name = 'CreateTransactionsTable1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'wallet_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'tx_hash',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'numeric',
            precision: 20,
            scale: 6,
            isNullable: false,
          },
          {
            name: 'to_address',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'network',
            type: 'varchar',
            length: '50',
            isNullable: false,
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

    // Crear foreign key constraint
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['wallet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'wallets',
        onDelete: 'CASCADE',
      })
    );

    // Crear índices para optimizar consultas
    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_wallet_id" ON "transactions" ("wallet_id")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_status" ON "transactions" ("status")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_tx_hash" ON "transactions" ("tx_hash")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
