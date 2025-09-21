import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletBalance } from '../entities/wallet-balance.entity';
import { BaseService } from './base.service';

@Injectable()
export class WalletBalancesService extends BaseService<WalletBalance> {
  constructor(
    @InjectRepository(WalletBalance)
    private readonly walletBalanceRepository: Repository<WalletBalance>,
  ) {
    super(walletBalanceRepository);
  }

  async findByWalletId(walletId: number): Promise<WalletBalance[]> {
    return this.walletBalanceRepository.find({ 
      where: { wallet_id: walletId },
      relations: ['token']
    });
  }

  async findByTokenId(tokenId: number): Promise<WalletBalance[]> {
    return this.walletBalanceRepository.find({ 
      where: { token_id: tokenId },
      relations: ['wallet']
    });
  }

  async findByWalletAndToken(walletId: number, tokenId: number): Promise<WalletBalance | null> {
    return this.walletBalanceRepository.findOne({ 
      where: { wallet_id: walletId, token_id: tokenId },
      relations: ['wallet', 'token']
    });
  }

  async getBalanceWithDetails(walletId: number, tokenId: number): Promise<WalletBalance | null> {
    return this.walletBalanceRepository.findOne({
      where: { wallet_id: walletId, token_id: tokenId },
      relations: ['wallet', 'wallet.user', 'token'],
    });
  }

  async updateBalance(walletId: number, tokenId: number, newBalance: number): Promise<WalletBalance | null> {
    const existingBalance = await this.findByWalletAndToken(walletId, tokenId);
    
    if (existingBalance) {
      await this.walletBalanceRepository.update(existingBalance.id, { 
        balance: newBalance,
        last_updated: new Date()
      });
      return this.findById(existingBalance.id);
    } else {
      // Crear nuevo balance si no existe
      const newWalletBalance = this.walletBalanceRepository.create({
        wallet_id: walletId,
        token_id: tokenId,
        balance: newBalance,
        last_updated: new Date()
      });
      return this.walletBalanceRepository.save(newWalletBalance);
    }
  }

  async addToBalance(walletId: number, tokenId: number, amount: number): Promise<WalletBalance | null> {
    const existingBalance = await this.findByWalletAndToken(walletId, tokenId);
    
    if (existingBalance) {
      const newBalance = Number(existingBalance.balance) + amount;
      return this.updateBalance(walletId, tokenId, newBalance);
    } else {
      return this.updateBalance(walletId, tokenId, amount);
    }
  }

  async subtractFromBalance(walletId: number, tokenId: number, amount: number): Promise<WalletBalance | null> {
    const existingBalance = await this.findByWalletAndToken(walletId, tokenId);
    
    if (existingBalance) {
      const newBalance = Math.max(0, Number(existingBalance.balance) - amount);
      return this.updateBalance(walletId, tokenId, newBalance);
    }
    
    return null;
  }

  async getNonZeroBalances(walletId: number): Promise<WalletBalance[]> {
    return this.walletBalanceRepository
      .createQueryBuilder('balance')
      .leftJoinAndSelect('balance.token', 'token')
      .where('balance.wallet_id = :walletId', { walletId })
      .andWhere('balance.balance > 0')
      .orderBy('balance.balance', 'DESC')
      .getMany();
  }

  async getAllBalancesForWallet(walletId: number): Promise<WalletBalance[]> {
    return this.walletBalanceRepository.find({
      where: { wallet_id: walletId },
      relations: ['token'],
      order: { balance: 'DESC' }
    });
  }

  async getTotalValueByToken(tokenId: number): Promise<number> {
    const result = await this.walletBalanceRepository
      .createQueryBuilder('balance')
      .select('SUM(balance.balance)', 'total')
      .where('balance.token_id = :tokenId', { tokenId })
      .getRawOne();
    
    return Number(result.total) || 0;
  }

  async refreshBalance(walletId: number, tokenId: number): Promise<WalletBalance | null> {
    // Aquí podrías implementar la lógica para obtener el balance real desde la blockchain
    // Por ahora solo actualizamos el timestamp
    const balance = await this.findByWalletAndToken(walletId, tokenId);
    if (balance) {
      await this.walletBalanceRepository.update(balance.id, { 
        last_updated: new Date()
      });
      return this.findById(balance.id);
    }
    return null;
  }
}
