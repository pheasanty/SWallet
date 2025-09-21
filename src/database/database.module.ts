import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Usar URL completa si está disponible (Render)
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            synchronize: false,
            migrationsRun: configService.get('NODE_ENV') === 'production',
            logging: configService.get('NODE_ENV') === 'development',
            ssl: {
              rejectUnauthorized: false
            },
          };
        }
        
        // Usar variables individuales
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST') || configService.get('DB_HOST'),
          port: parseInt(configService.get('DATABASE_PORT') || configService.get('DB_PORT') || '5432'),
          username: configService.get('DATABASE_USERNAME') || configService.get('DB_USER'),
          password: configService.get('DATABASE_PASSWORD') || configService.get('DB_PASSWORD'),
          database: configService.get('DATABASE_NAME') || configService.get('DB_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../migrations/*{.ts,.js}'],
          synchronize: false,
          migrationsRun: configService.get('NODE_ENV') === 'production',
          logging: configService.get('NODE_ENV') === 'development',
          ssl: {
            rejectUnauthorized: false
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
