import { Controller, Post, Get, Body, Headers, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { email?: string; phone?: string; password: string },
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    const emailOrPhone = body.email ?? body.phone;
    const ipAddress = forwardedFor?.split(',')[0]?.trim();
    return this.authService.login({
      emailOrPhone: emailOrPhone as string,
      password: body.password,
      ipAddress,
      userAgent,
    });
  }

  @Get('verify')
  async verifyToken(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido');
    }
    
    const token = auth.substring(7);
    
    try {
      const payload = this.jwtService.verify(token);
      return {
        success: true,
        payload,
        message: 'Token válido'
      };
    } catch (error) {
      console.error('Token verification error:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}


