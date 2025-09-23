# SWallet API - Sistema de Wallets con Funcionalidades Reales

## 🚀 Características Implementadas

### ✅ Sistema de Wallets Mejorado
- **UUID único** para cada wallet (no autoincremental)
- **Generación automática de claves privadas** criptográficamente seguras
- **Encriptación de claves privadas** con contraseña del usuario
- **Recuperación de wallets** usando clave privada
- **Validación de direcciones** para diferentes redes

### ✅ Sistema de Transferencias
- **Transferencias entre wallets** por dirección o email
- **Múltiples redes soportadas**: BEP20, Stellar, Ethereum
- **Validación de saldos** antes de transferir
- **Historial de transacciones** completo
- **Estados de transacción**: pending, confirmed, failed

### ✅ Seguridad Implementada
- **Autenticación JWT** con guards
- **Encriptación AES-256** para claves privadas
- **Validación de permisos** (usuarios solo acceden a sus wallets)
- **Hashing seguro** de contraseñas con bcrypt
- **Validación de entrada** en todos los endpoints

## 🛠️ Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crear archivo `.env` basado en `env.example`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=swallet
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h
```

### 3. Ejecutar Migraciones
```bash
npm run migration:run
```

### 4. Inicializar Datos de Ejemplo
```bash
node scripts/init-sample-data.js
```

### 5. Iniciar el Servidor
```bash
npm run start:dev
```

## 📚 Endpoints Disponibles

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario

### Wallets
- `POST /wallets` - Crear nueva wallet
- `POST /wallets/recover` - Recuperar wallet con clave privada
- `GET /wallets` - Obtener wallets del usuario
- `GET /wallets/:walletId` - Obtener wallet específica
- `POST /wallets/:walletId/private-key` - Obtener clave privada
- `PUT /wallets/:walletId/password` - Actualizar contraseña
- `DELETE /wallets/:walletId/private-key` - Eliminar clave privada
- `GET /wallets/search/by-email` - Buscar wallet por email
- `POST /wallets/validate-address` - Validar dirección

### Transferencias
- `POST /transfers` - Realizar transferencia
- `GET /transfers/balance/:walletId/:tokenId` - Obtener saldo
- `GET /transfers/balances/:walletId` - Obtener todos los balances
- `GET /transfers/history/:walletId` - Historial de transacciones
- `GET /transfers/transaction/:txHash` - Obtener transacción por hash
- `POST /transfers/validate` - Validar transferencia
- `POST /transfers/initialize-balance` - Inicializar saldo

## 🔐 Credenciales de Prueba

Se ha creado un usuario de prueba con las siguientes credenciales:
- **Email**: `demo@swallet.com`
- **Password**: `password123`

Este usuario tiene wallets creadas en las tres redes soportadas.

## 💡 Ejemplos de Uso

### Crear una Wallet
```javascript
const response = await fetch('/wallets', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer tu_jwt_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    network: 'bep20',
    password: 'miPasswordSegura'
  })
});
```

### Realizar una Transferencia
```javascript
const response = await fetch('/transfers', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer tu_jwt_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fromWalletId: 'uuid-de-tu-wallet',
    toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    amount: 100.5,
    tokenSymbol: 'USDT',
    network: 'bep20',
    password: 'miPasswordSegura'
  })
});
```

### Transferir por Email
```javascript
const response = await fetch('/transfers', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer tu_jwt_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fromWalletId: 'uuid-de-tu-wallet',
    toEmail: 'destinatario@ejemplo.com',
    amount: 50.0,
    tokenSymbol: 'BNB',
    network: 'bep20',
    privateKey: 'tu_clave_privada'
  })
});
```

## 🏗️ Arquitectura del Sistema

### Entidades Principales
- **User**: Usuarios del sistema
- **Wallet**: Wallets con UUID y claves encriptadas
- **Transaction**: Transacciones entre wallets
- **Token**: Tokens soportados por red
- **WalletBalance**: Balances de tokens por wallet

### Servicios
- **CryptoService**: Generación y encriptación de claves
- **WalletsService**: Gestión de wallets
- **TransfersService**: Procesamiento de transferencias
- **UsersService**: Gestión de usuarios

### Seguridad
- **JwtAuthGuard**: Protección de endpoints
- **Encriptación AES-256**: Para claves privadas
- **Validación de permisos**: Usuarios solo acceden a sus datos
- **Hashing bcrypt**: Para contraseñas

## 🔧 Configuración de Redes

### Tokens Soportados

#### BEP20 (Binance Smart Chain)
- BNB (Binance Coin)
- USDT (Tether USD)
- USDC (USD Coin)
- BUSD (Binance USD)

#### Stellar
- XLM (Stellar Lumens)
- USDC (USD Coin)

#### Ethereum
- ETH (Ethereum)
- USDT (Tether USD)
- USDC (USD Coin)
- WBTC (Wrapped Bitcoin)

## 📱 Frontend Integration

Ver archivo `frontend-examples.md` para ejemplos completos de integración con frontend usando fetch, incluyendo:

- Clase SWalletAPI completa
- Manejo de errores
- Ejemplos de autenticación
- Gestión de wallets
- Realización de transferencias
- Manejo de estados de carga

## 🚨 Consideraciones de Seguridad

1. **Nunca almacenes claves privadas en texto plano** en el frontend
2. **Usa HTTPS en producción** para proteger las comunicaciones
3. **Implementa rate limiting** para prevenir ataques de fuerza bruta
4. **Valida todas las entradas** del usuario
5. **Usa contraseñas seguras** para encriptar claves privadas
6. **Implementa logs de auditoría** para transacciones importantes

## 🔄 Próximas Mejoras

- [ ] Integración real con blockchains (Web3, Stellar SDK)
- [ ] Sistema de notificaciones
- [ ] Dashboard de administración
- [ ] API de precios en tiempo real
- [ ] Sistema de comisiones dinámicas
- [ ] Soporte para más redes (Polygon, Avalanche, etc.)
- [ ] Sistema de backup y recuperación
- [ ] Análisis de transacciones y reportes

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación, revisa:
1. Los ejemplos en `frontend-examples.md`
2. Los logs del servidor para errores
3. La documentación de la API en Postman (archivo incluido)

---

**¡El sistema está listo para usar!** 🎉

Puedes comenzar creando usuarios, wallets y realizando transferencias usando los endpoints documentados.
