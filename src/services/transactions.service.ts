import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { BaseService } from './base.service';

@Injectable()
export class TransactionsService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    super(transactionRepository);
  }

  async findByWalletId(walletId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { wallet_id: walletId } });
  }

  async findByTxHash(txHash: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { tx_hash: txHash } });
  }

  async findByStatus(status: 'pending' | 'confirmed' | 'failed'): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { status } });
  }

  async findByNetwork(network: string): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { network } });
  }

  async findByToAddress(toAddress: string): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { to_address: toAddress } });
  }

  async getTransactionWithFee(transactionId: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['fee', 'fee.feeToken'],
    });
  }

  async getTransactionWithWallet(transactionId: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['wallet', 'wallet.user'],
    });
  }

  async createTransaction(
    walletId: string,
    amount: number,
    toAddress: string,
    network: string,
    txHash?: string,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      wallet_id: walletId,
      amount,
      to_address: toAddress,
      network,
      tx_hash: txHash,
      status: 'pending',
    });
    return this.transactionRepository.save(transaction);
  }

  async updateStatus(transactionId: number, status: 'pending' | 'confirmed' | 'failed'): Promise<Transaction | null> {
    await this.transactionRepository.update(transactionId, { status });
    return this.findById(transactionId);
  }

  async updateTxHash(transactionId: number, txHash: string): Promise<Transaction | null> {
    await this.transactionRepository.update(transactionId, { tx_hash: txHash });
    return this.findById(transactionId);
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    return this.findByStatus('pending');
  }

  async getConfirmedTransactions(): Promise<Transaction[]> {
    return this.findByStatus('confirmed');
  }

  async getFailedTransactions(): Promise<Transaction[]> {
    return this.findByStatus('failed');
  }
}
