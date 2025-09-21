import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { WalletsService } from '../../services/wallets.service';
import { WalletBalancesService } from '../../services/wallet-balances.service';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly walletBalancesService: WalletBalancesService,
  ) {}

  @Get()
  async findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.walletsService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number) {
    return this.walletsService.findByUserId(userId);
  }

  @Get('network/:network')
  async findByNetwork(@Param('network') network: string) {
    return this.walletsService.findByNetwork(network);
  }

  @Get(':id/transactions')
  async getWalletWithTransactions(@Param('id') id: number) {
    return this.walletsService.getWalletWithTransactions(id);
  }

  @Get(':id/balances')
  async getWalletWithBalances(@Param('id') id: number) {
    return this.walletsService.getWalletWithBalances(id);
  }

  @Post()
  async create(@Body() createWalletDto: any) {
    const { userId, network, address, privateKey } = createWalletDto;
    return this.walletsService.createWallet(userId, network, address, privateKey);
  }

  @Put(':id/private-key')
  async updatePrivateKey(@Param('id') id: number, @Body() body: { privateKey: string }) {
    return this.walletsService.updatePrivateKey(id, body.privateKey);
  }

  @Delete(':id/private-key')
  async removePrivateKey(@Param('id') id: number) {
    return this.walletsService.removePrivateKey(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.walletsService.delete(id);
  }

  // Wallet Balances endpoints
  @Get(':id/balances/all')
  async getAllBalances(@Param('id') walletId: number) {
    return this.walletBalancesService.getAllBalancesForWallet(walletId);
  }

  @Get(':id/balances/non-zero')
  async getNonZeroBalances(@Param('id') walletId: number) {
    return this.walletBalancesService.getNonZeroBalances(walletId);
  }

  @Put(':id/balances/:tokenId')
  async updateBalance(
    @Param('id') walletId: number,
    @Param('tokenId') tokenId: number,
    @Body() body: { balance: number }
  ) {
    return this.walletBalancesService.updateBalance(walletId, tokenId, body.balance);
  }

  @Post(':id/balances/:tokenId/add')
  async addToBalance(
    @Param('id') walletId: number,
    @Param('tokenId') tokenId: number,
    @Body() body: { amount: number }
  ) {
    return this.walletBalancesService.addToBalance(walletId, tokenId, body.amount);
  }

  @Post(':id/balances/:tokenId/subtract')
  async subtractFromBalance(
    @Param('id') walletId: number,
    @Param('tokenId') tokenId: number,
    @Body() body: { amount: number }
  ) {
    return this.walletBalancesService.subtractFromBalance(walletId, tokenId, body.amount);
  }
}
