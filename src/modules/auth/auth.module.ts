import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from '../../config/app.config';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../../entities/user.entity';
import { UserSession } from '../../entities/user-session.entity';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    TypeOrmModule.forFeature([User, UserSession]),
    JwtModule.register({
      secret: appConfig.jwt.secret,
      signOptions: { expiresIn: appConfig.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}


