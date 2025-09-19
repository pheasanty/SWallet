-- Script para inicializar la base de datos SWallet
-- Ejecutar este script en PostgreSQL antes de iniciar la aplicación

-- Crear la base de datos si no existe
-- CREATE DATABASE swallet;

-- Conectar a la base de datos swallet
-- \c swallet;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- La tabla 'users' se creará automáticamente por TypeORM
-- cuando la aplicación se ejecute por primera vez

-- Verificar que la extensión UUID esté disponible
SELECT uuid_generate_v4() as test_uuid;
