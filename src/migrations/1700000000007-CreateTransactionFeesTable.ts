import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTransactionFeesTable1700000000007 implements MigrationInterface {
  name = 'CreateTransactionFeesTable1700000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction_fees',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'transaction_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'fee_amount',
            type: 'numeric',
            precision: 20,
            scale: 6,
            isNullable: false,
          },
          {
            name: 'fee_token_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'gas_used',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'gas_price',
            type: 'bigint',
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

    // Crear foreign keys
    await queryRunner.createForeignKey(
      'transaction_fees',
      new TableForeignKey({
        columnNames: ['transaction_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transactions',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'transaction_fees',
      new TableForeignKey({
        columnNames: ['fee_token_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tokens',
        onDelete: 'CASCADE',
      })
    );

    // Crear índice único
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_transaction_fees_transaction" ON "transaction_fees" ("transaction_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transaction_fees');
  }
}
