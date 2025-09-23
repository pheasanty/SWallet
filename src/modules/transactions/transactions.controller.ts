import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionFeesService } from '../../services/transaction-fees.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionFeesService: TransactionFeesService,
  ) {}

  @Get()
  async findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.transactionsService.findById(id);
  }

  @Get('wallet/:walletId')
  async findByWalletId(@Param('walletId') walletId: string) {
    return this.transactionsService.findByWalletId(walletId);
  }

  @Get('hash/:txHash')
  async findByTxHash(@Param('txHash') txHash: string) {
    return this.transactionsService.findByTxHash(txHash);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: 'pending' | 'confirmed' | 'failed') {
    return this.transactionsService.findByStatus(status);
  }

  @Get('network/:network')
  async findByNetwork(@Param('network') network: string) {
    return this.transactionsService.findByNetwork(network);
  }

  @Get('pending')
  async getPendingTransactions() {
    return this.transactionsService.getPendingTransactions();
  }

  @Get('confirmed')
  async getConfirmedTransactions() {
    return this.transactionsService.getConfirmedTransactions();
  }

  @Get('failed')
  async getFailedTransactions() {
    return this.transactionsService.getFailedTransactions();
  }

  @Get(':id/with-fee')
  async getTransactionWithFee(@Param('id') id: number) {
    return this.transactionsService.getTransactionWithFee(id);
  }

  @Get(':id/with-wallet')
  async getTransactionWithWallet(@Param('id') id: number) {
    return this.transactionsService.getTransactionWithWallet(id);
  }

  @Post()
  async create(@Body() createTransactionDto: any) {
    const { walletId, amount, toAddress, network, txHash } = createTransactionDto;
    return this.transactionsService.createTransaction(walletId, amount, toAddress, network, txHash);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() body: { status: 'pending' | 'confirmed' | 'failed' }
  ) {
    return this.transactionsService.updateStatus(id, body.status);
  }

  @Put(':id/tx-hash')
  async updateTxHash(
    @Param('id') id: number,
    @Body() body: { txHash: string }
  ) {
    return this.transactionsService.updateTxHash(id, body.txHash);
  }

  // Transaction Fees endpoints
  @Get(':id/fee')
  async getTransactionFee(@Param('id') transactionId: number) {
    return this.transactionFeesService.findByTransactionId(transactionId);
  }

  @Post(':id/fee')
  async createTransactionFee(
    @Param('id') transactionId: number,
    @Body() body: { feeAmount: number; feeTokenId: number; gasUsed?: number; gasPrice?: number }
  ) {
    const { feeAmount, feeTokenId, gasUsed, gasPrice } = body;
    return this.transactionFeesService.createTransactionFee(transactionId, feeAmount, feeTokenId, gasUsed, gasPrice);
  }

  @Put('fee/:feeId/gas')
  async updateGasInfo(
    @Param('feeId') feeId: number,
    @Body() body: { gasUsed: number; gasPrice: number }
  ) {
    const { gasUsed, gasPrice } = body;
    return this.transactionFeesService.updateGasInfo(feeId, gasUsed, gasPrice);
  }

  @Put('fee/:feeId/amount')
  async updateFeeAmount(
    @Param('feeId') feeId: number,
    @Body() body: { feeAmount: number }
  ) {
    return this.transactionFeesService.updateFeeAmount(feeId, body.feeAmount);
  }

  @Get('fees/token/:tokenId/total')
  async getTotalFeesByToken(@Param('tokenId') tokenId: number) {
    return this.transactionFeesService.getTotalFeesByToken(tokenId);
  }

  @Get('fees/average-gas-price')
  async getAverageGasPrice() {
    return this.transactionFeesService.getAverageGasPrice();
  }

  @Get('fees/total-gas-used')
  async getTotalGasUsed() {
    return this.transactionFeesService.getTotalGasUsed();
  }

  @Get('fees/recent')
  async getRecentFees(@Query('limit') limit: number = 50) {
    return this.transactionFeesService.getRecentFees(limit);
  }
}
