import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BaseService } from './base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: true } });
  }

  async findVerifiedUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { isEmailVerified: true } });
  }

  async updateBalance(userId: number, amount: number): Promise<User | null> {
    await this.userRepository.update(userId, { balance: amount });
    return this.findById(userId);
  }

  async verifyEmail(userId: number): Promise<User | null> {
    await this.userRepository.update(userId, { isEmailVerified: true });
    return this.findById(userId);
  }

  async deactivateUser(userId: number): Promise<User | null> {
    await this.userRepository.update(userId, { isActive: false });
    return this.findById(userId);
  }

  async getUserWithWallets(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallets'],
    });
  }

  async getUserWithAuditLogs(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['auditLogs'],
    });
  }
}
