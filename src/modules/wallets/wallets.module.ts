import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from '../../services/wallets.service';
import { WalletBalancesService } from '../../services/wallet-balances.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from '../../entities/wallet.entity';
import { WalletBalance } from '../../entities/wallet-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletBalance])],
  controllers: [WalletsController],
  providers: [WalletsService, WalletBalancesService],
  exports: [WalletsService, WalletBalancesService],
})
export class WalletsModule {}
