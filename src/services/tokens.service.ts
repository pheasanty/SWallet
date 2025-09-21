import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { BaseService } from './base.service';

@Injectable()
export class TokensService extends BaseService<Token> {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository);
  }

  async findBySymbol(symbol: string): Promise<Token[]> {
    return this.tokenRepository.find({ where: { symbol } });
  }

  async findByNetwork(network: string): Promise<Token[]> {
    return this.tokenRepository.find({ where: { network } });
  }

  async findBySymbolAndNetwork(symbol: string, network: string): Promise<Token | null> {
    return this.tokenRepository.findOne({ where: { symbol, network } });
  }

  async findByContractAddress(contractAddress: string): Promise<Token | null> {
    return this.tokenRepository.findOne({ where: { contract_address: contractAddress } });
  }

  async findActiveTokens(): Promise<Token[]> {
    return this.tokenRepository.find({ where: { is_active: true } });
  }

  async findActiveTokensByNetwork(network: string): Promise<Token[]> {
    return this.tokenRepository.find({ where: { network, is_active: true } });
  }

  async getTokenWithBalances(tokenId: number): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { id: tokenId },
      relations: ['walletBalances', 'walletBalances.wallet'],
    });
  }

  async createToken(
    symbol: string,
    name: string,
    network: string,
    contractAddress?: string,
    decimals: number = 18,
    logoUrl?: string,
  ): Promise<Token> {
    const token = this.tokenRepository.create({
      symbol,
      name,
      network,
      contract_address: contractAddress,
      decimals,
      logo_url: logoUrl,
      is_active: true,
    });
    return this.tokenRepository.save(token);
  }

  async activateToken(tokenId: number): Promise<Token | null> {
    await this.tokenRepository.update(tokenId, { is_active: true });
    return this.findById(tokenId);
  }

  async deactivateToken(tokenId: number): Promise<Token | null> {
    await this.tokenRepository.update(tokenId, { is_active: false });
    return this.findById(tokenId);
  }

  async updateLogoUrl(tokenId: number, logoUrl: string): Promise<Token | null> {
    await this.tokenRepository.update(tokenId, { logo_url: logoUrl });
    return this.findById(tokenId);
  }

  async getPopularTokens(limit: number = 20): Promise<Token[]> {
    return this.tokenRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
