import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TransfersController } from './transfers.controller';
import { TransfersService } from '../../services/transfers.service';
import { WalletsService } from '../../services/wallets.service';
import { CryptoService } from '../../services/crypto.service';
import { UsersService } from '../../services/users.service';
import { Transaction } from '../../entities/transaction.entity';
import { Wallet } from '../../entities/wallet.entity';
import { WalletBalance } from '../../entities/wallet-balance.entity';
import { Token } from '../../entities/token.entity';
import { User } from '../../entities/user.entity';
import { appConfig } from '../../config/app.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Wallet, WalletBalance, Token, User]),
    JwtModule.register({
      secret: appConfig.jwt.secret,
      signOptions: { expiresIn: appConfig.jwt.expiresIn },
    }),
  ],
  controllers: [TransfersController],
  providers: [TransfersService, WalletsService, CryptoService, UsersService],
  exports: [TransfersService],
})
export class TransfersModule {}
