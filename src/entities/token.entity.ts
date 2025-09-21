import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { WalletBalance } from './wallet-balance.entity';
import { TransactionFee } from './transaction-fee.entity';

@Entity('tokens')
@Index(['symbol', 'network'], { unique: true })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  symbol: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contract_address: string;

  @Column({ type: 'varchar', length: 50 })
  network: string;

  @Column({ type: 'integer', default: 18 })
  decimals: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @OneToMany(() => WalletBalance, balance => balance.token)
  walletBalances: WalletBalance[];

  @OneToMany(() => TransactionFee, fee => fee.feeToken)
  transactionFees: TransactionFee[];
}
