import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Token } from './token.entity';

@Entity('transaction_fees')
@Index(['transaction_id'], { unique: true })
export class TransactionFee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  transaction_id: number;

  @Column({ type: 'numeric', precision: 20, scale: 6 })
  fee_amount: number;

  @Column({ type: 'integer' })
  fee_token_id: number;

  @Column({ type: 'bigint', nullable: true })
  gas_used: number;

  @Column({ type: 'bigint', nullable: true })
  gas_price: number;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @OneToOne(() => Transaction, transaction => transaction.fee)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Token, token => token.transactionFees)
  @JoinColumn({ name: 'fee_token_id' })
  feeToken: Token;
}
