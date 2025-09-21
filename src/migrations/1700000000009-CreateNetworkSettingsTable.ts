import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNetworkSettingsTable1700000000009 implements MigrationInterface {
  name = 'CreateNetworkSettingsTable1700000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'network_settings',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'network_name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'rpc_url',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'chain_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'block_explorer_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'gas_limit',
            type: 'bigint',
            default: 21000,
            isNullable: false,
          },
          {
            name: 'min_gas_price',
            type: 'bigint',
            default: 1,
            isNullable: false,
          },
          {
            name: 'max_gas_price',
            type: 'bigint',
            default: 1000000000,
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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

    // Crear índice único
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_network_settings_name" ON "network_settings" ("network_name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('network_settings');
  }
}
