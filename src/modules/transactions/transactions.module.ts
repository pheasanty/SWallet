import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionFeesService } from '../../services/transaction-fees.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionFee } from '../../entities/transaction-fee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionFee])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionFeesService],
  exports: [TransactionsService, TransactionFeesService],
})
export class TransactionsModule {}
