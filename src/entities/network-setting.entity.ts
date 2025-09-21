import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('network_settings')
@Index(['network_name'], { unique: true })
export class NetworkSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  network_name: string;

  @Column({ type: 'varchar', length: 500 })
  rpc_url: string;

  @Column({ type: 'integer', nullable: true })
  chain_id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  block_explorer_url: string;

  @Column({ type: 'bigint', default: 21000 })
  gas_limit: number;

  @Column({ type: 'bigint', default: 1 })
  min_gas_price: number;

  @Column({ type: 'bigint', default: 1000000000 })
  max_gas_price: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
