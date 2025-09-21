import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import { Transaction } from '../entities/transaction.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { Token } from '../entities/token.entity';
import { WalletBalance } from '../entities/wallet-balance.entity';
import { TransactionFee } from '../entities/transaction-fee.entity';
import { UserSession } from '../entities/user-session.entity';
import { NetworkSetting } from '../entities/network-setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Transaction,
      AuditLog,
      Token,
      WalletBalance,
      TransactionFee,
      UserSession,
      NetworkSetting,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
