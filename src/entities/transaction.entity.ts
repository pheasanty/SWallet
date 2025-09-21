import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { TransactionFee } from './transaction-fee.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  wallet_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tx_hash: string;

  @Column({ type: 'numeric', precision: 20, scale: 6 })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  to_address: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'failed']
  })
  status: 'pending' | 'confirmed' | 'failed';

  @Column({ type: 'varchar', length: 50 })
  network: string;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @OneToOne(() => TransactionFee, fee => fee.transaction)
  fee: TransactionFee;
}
