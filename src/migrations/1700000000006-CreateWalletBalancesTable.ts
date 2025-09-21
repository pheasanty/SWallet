import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateWalletBalancesTable1700000000006 implements MigrationInterface {
  name = 'CreateWalletBalancesTable1700000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'wallet_balances',
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
            name: 'token_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'balance',
            type: 'numeric',
            precision: 30,
            scale: 18,
            default: 0,
            isNullable: false,
          },
          {
            name: 'last_updated',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Crear foreign keys
    await queryRunner.createForeignKey(
      'wallet_balances',
      new TableForeignKey({
        columnNames: ['wallet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'wallets',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'wallet_balances',
      new TableForeignKey({
        columnNames: ['token_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tokens',
        onDelete: 'CASCADE',
      })
    );

    // Crear índice único para wallet + token
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_wallet_balances_wallet_token" ON "wallet_balances" ("wallet_id", "token_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wallet_balances');
  }
}
