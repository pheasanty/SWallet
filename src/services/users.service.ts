import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { BaseService } from './base.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // Se sobreescribe el método 'create' de la clase base para añadir lógica específica
  // Se encarga de hashear la contraseña antes de guardar al usuario.
  async create(createUserDto: DeepPartial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  // Se sobreescribe el método 'update' para hashear la contraseña solo si se actualiza.
  async update(id: number, updateUserDto: DeepPartial<User>): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  // Métodos de consulta especializados

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