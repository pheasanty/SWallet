import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionFee } from '../entities/transaction-fee.entity';
import { BaseService } from './base.service';

@Injectable()
export class TransactionFeesService extends BaseService<TransactionFee> {
  constructor(
    @InjectRepository(TransactionFee)
    private readonly transactionFeeRepository: Repository<TransactionFee>,
  ) {
    super(transactionFeeRepository);
  }

  async findByTransactionId(transactionId: number): Promise<TransactionFee | null> {
    return this.transactionFeeRepository.findOne({ 
      where: { transaction_id: transactionId },
      relations: ['transaction', 'feeToken']
    });
  }

  async findByFeeTokenId(feeTokenId: number): Promise<TransactionFee[]> {
    return this.transactionFeeRepository.find({ 
      where: { fee_token_id: feeTokenId },
      relations: ['transaction']
    });
  }

  async getFeeWithDetails(feeId: number): Promise<TransactionFee | null> {
    return this.transactionFeeRepository.findOne({
      where: { id: feeId },
      relations: ['transaction', 'transaction.wallet', 'feeToken'],
    });
  }

  async createTransactionFee(
    transactionId: number,
    feeAmount: number,
    feeTokenId: number,
    gasUsed?: number,
    gasPrice?: number,
  ): Promise<TransactionFee> {
    const transactionFee = this.transactionFeeRepository.create({
      transaction_id: transactionId,
      fee_amount: feeAmount,
      fee_token_id: feeTokenId,
      gas_used: gasUsed,
      gas_price: gasPrice,
    });
    return this.transactionFeeRepository.save(transactionFee);
  }

  async updateGasInfo(feeId: number, gasUsed: number, gasPrice: number): Promise<TransactionFee | null> {
    await this.transactionFeeRepository.update(feeId, { 
      gas_used: gasUsed,
      gas_price: gasPrice
    });
    return this.findById(feeId);
  }

  async updateFeeAmount(feeId: number, feeAmount: number): Promise<TransactionFee | null> {
    await this.transactionFeeRepository.update(feeId, { fee_amount: feeAmount });
    return this.findById(feeId);
  }

  async getTotalFeesByToken(feeTokenId: number): Promise<number> {
    const result = await this.transactionFeeRepository
      .createQueryBuilder('fee')
      .select('SUM(fee.fee_amount)', 'total')
      .where('fee.fee_token_id = :feeTokenId', { feeTokenId })
      .getRawOne();
    
    return Number(result.total) || 0;
  }

  async getAverageGasPrice(): Promise<number> {
    const result = await this.transactionFeeRepository
      .createQueryBuilder('fee')
      .select('AVG(fee.gas_price)', 'average')
      .where('fee.gas_price IS NOT NULL')
      .getRawOne();
    
    return Number(result.average) || 0;
  }

  async getTotalGasUsed(): Promise<number> {
    const result = await this.transactionFeeRepository
      .createQueryBuilder('fee')
      .select('SUM(fee.gas_used)', 'total')
      .where('fee.gas_used IS NOT NULL')
      .getRawOne();
    
    return Number(result.total) || 0;
  }

  async getFeesByDateRange(startDate: Date, endDate: Date): Promise<TransactionFee[]> {
    return this.transactionFeeRepository
      .createQueryBuilder('fee')
      .leftJoinAndSelect('fee.transaction', 'transaction')
      .leftJoinAndSelect('fee.feeToken', 'token')
      .where('fee.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('fee.created_at', 'DESC')
      .getMany();
  }

  async getRecentFees(limit: number = 50): Promise<TransactionFee[]> {
    return this.transactionFeeRepository.find({
      relations: ['transaction', 'feeToken'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
