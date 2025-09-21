import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Token } from './token.entity';

@Entity('wallet_balances')
@Index(['wallet_id', 'token_id'], { unique: true })
export class WalletBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  wallet_id: number;

  @Column({ type: 'integer' })
  token_id: number;

  @Column({ type: 'numeric', precision: 30, scale: 18, default: 0 })
  balance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date;

  // Relaciones
  @ManyToOne(() => Wallet, wallet => wallet.balances)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @ManyToOne(() => Token, token => token.walletBalances)
  @JoinColumn({ name: 'token_id' })
  token: Token;
}
