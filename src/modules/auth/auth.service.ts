import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../services/users.service';
import { UserSessionsService } from '../../services/user-sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSessionsService: UserSessionsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(emailOrPhone: string, password: string) {
    const user = emailOrPhone.includes('@')
      ? await this.usersService.findByEmail(emailOrPhone)
      : await this.usersService.findByPhone(emailOrPhone);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async login(params: {
    emailOrPhone: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { emailOrPhone, password, ipAddress, userAgent } = params;
    if (!emailOrPhone || !password) {
      throw new BadRequestException('email/phone y password son requeridos');
    }

    const user = await this.validateUser(emailOrPhone, password);

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    // Refresh token con expiración más larga
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    // Crear sesión persistida
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userSessionsService.createSession(
      user.id,
      accessToken,
      expiresAt,
      refreshToken,
      ipAddress,
      userAgent,
    );

    // No retornar password
    const { password: _omit, ...safeUser } = user as any;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }
}


