import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import { EntitiesModule } from '../database/entities.module';
import { UsersModule } from '../modules/users/users.module';
import { WalletsModule } from '../modules/wallets/wallets.module';
import { TransactionsModule } from '../modules/transactions/transactions.module';
import { TokensModule } from '../modules/tokens/tokens.module';
import { AuditModule } from '../modules/audit/audit.module';
import { SessionsModule } from '../modules/sessions/sessions.module';
import { NetworksModule } from '../modules/networks/networks.module';
import { AuthModule } from '../modules/auth/auth.module';
import { TransfersModule } from '../modules/transfers/transfers.module';

@Module({
  imports: [
    DatabaseModule,
    EntitiesModule,
    UsersModule,
    WalletsModule,
    TransactionsModule,
    TokensModule,
    AuditModule,
    SessionsModule,
    NetworksModule,
    AuthModule,
    TransfersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
