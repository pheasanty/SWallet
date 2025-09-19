import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Bienvenido a SWallet! 🚀';
  }

  getHealth(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'Servidor funcionando correctamente'
    };
  }

  getInfo(): object {
    return {
      name: 'SWallet',
      version: '1.0.0',
      description: 'Sistema de billetera digital',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      database: {
        type: 'PostgreSQL',
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || '5432',
        name: process.env.DATABASE_NAME || 'swallet',
      }
    };
  }
}
