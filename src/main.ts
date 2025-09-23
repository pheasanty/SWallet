import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { appConfig } from './config/app.config';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Polyfill para crypto.randomUUID en Node.js 18
if (!globalThis.crypto) {
  const { webcrypto } = require('crypto');
  globalThis.crypto = webcrypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS con configuración
  app.enableCors({
    origin: appConfig.cors.origin,
    methods: appConfig.cors.methods as any,
    allowedHeaders: appConfig.cors.allowedHeaders,
    credentials: true,
  });
  
  // Configurar prefijo global para todas las rutas
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor SWallet ejecutándose en: http://localhost:${port}/api`);
}

bootstrap();
