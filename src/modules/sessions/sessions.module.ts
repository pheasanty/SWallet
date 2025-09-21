import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionsService } from '../../services/user-sessions.service';
import { SessionsController } from './sessions.controller';
import { UserSession } from '../../entities/user-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  controllers: [SessionsController],
  providers: [UserSessionsService],
  exports: [UserSessionsService],
})
export class SessionsModule {}
