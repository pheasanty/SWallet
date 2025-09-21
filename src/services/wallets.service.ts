import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { BaseService } from './base.service';

@Injectable()
export class WalletsService extends BaseService<Wallet> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {
    super(walletRepository);
  }

  async findByUserId(userId: number): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { user_id: userId } });
  }

  async findByAddress(address: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { address } });
  }

  async findByNetwork(network: string): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { network } });
  }

  async findByUserAndNetwork(userId: number, network: string): Promise<Wallet[]> {
    return this.walletRepository.find({ 
      where: { user_id: userId, network } 
    });
  }

  async findByAddressAndNetwork(address: string, network: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ 
      where: { address, network } 
    });
  }

  async getWalletWithTransactions(walletId: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['transactions', 'balances'],
    });
  }

  async getWalletWithBalances(walletId: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['balances', 'balances.token'],
    });
  }

  async createWallet(userId: number, network: string, address: string, privateKey?: string): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      user_id: userId,
      network,
      address,
      private_key: privateKey,
    });
    return this.walletRepository.save(wallet);
  }

  async updatePrivateKey(walletId: number, privateKey: string): Promise<Wallet | null> {
    await this.walletRepository.update(walletId, { private_key: privateKey });
    return this.findById(walletId);
  }

  async removePrivateKey(walletId: number): Promise<Wallet | null> {
    await this.walletRepository.update(walletId, { private_key: null });
    return this.findById(walletId);
  }
}
