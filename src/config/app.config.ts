export const appConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuración de la aplicación
  app: {
    name: 'SWallet',
    version: '1.0.0',
    description: 'Sistema de billetera digital',
  },
  
  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  // Configuración de base de datos (para futuras implementaciones)
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/swallet',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '27017'),
    name: process.env.DATABASE_NAME || 'swallet',
  },
  
  // Configuración JWT (para autenticación futura)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};
