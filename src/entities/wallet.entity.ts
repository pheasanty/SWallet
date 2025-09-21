import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { WalletBalance } from './wallet-balance.entity';

@Entity('wallets')
@Index(['address', 'network'], { unique: true })
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  user_id: number;

  @Column({ type: 'varchar', length: 50 })
  network: string; // 'bep20' | 'stellar'

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'text', nullable: true })
  private_key: string;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];

  @OneToMany(() => WalletBalance, balance => balance.wallet)
  balances: WalletBalance[];
}
