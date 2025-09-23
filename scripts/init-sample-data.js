const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'swallet',
});

async function initSampleData() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    // Insertar tokens de ejemplo
    console.log('Insertando tokens...');
    
    const tokens = [
      // BEP20 tokens
      ['BNB', 'Binance Coin', '0x0000000000000000000000000000000000000000', 'bep20', 18, true, 'https://cryptologos.cc/logos/bnb-bnb-logo.png'],
      ['USDT', 'Tether USD', '0x55d398326f99059fF775485246999027B3197955', 'bep20', 18, true, 'https://cryptologos.cc/logos/tether-usdt-logo.png'],
      ['USDC', 'USD Coin', '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 'bep20', 18, true, 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'],
      ['BUSD', 'Binance USD', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 'bep20', 18, true, 'https://cryptologos.cc/logos/binance-usd-busd-logo.png'],
      
      // Stellar tokens
      ['XLM', 'Stellar Lumens', null, 'stellar', 7, true, 'https://cryptologos.cc/logos/stellar-xlm-logo.png'],
      ['USDC', 'USD Coin', 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', 'stellar', 7, true, 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'],
      
      // Ethereum tokens
      ['ETH', 'Ethereum', '0x0000000000000000000000000000000000000000', 'ethereum', 18, true, 'https://cryptologos.cc/logos/ethereum-eth-logo.png'],
      ['USDT', 'Tether USD', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'ethereum', 6, true, 'https://cryptologos.cc/logos/tether-usdt-logo.png'],
    ];

    for (const token of tokens) {
      const [symbol, name, contract_address, network, decimals, is_active, logo_url] = token;
      
      // Verificar si el token ya existe
      const existingToken = await client.query(
        'SELECT id FROM tokens WHERE symbol = $1 AND network = $2',
        [symbol, network]
      );

      if (existingToken.rows.length === 0) {
        await client.query(
          `INSERT INTO tokens (symbol, name, contract_address, network, decimals, is_active, logo_url, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [symbol, name, contract_address, network, decimals, is_active, logo_url]
        );
        console.log(`Token ${symbol} (${network}) insertado`);
      } else {
        console.log(`Token ${symbol} (${network}) ya existe`);
      }
    }

    // Crear un usuario de ejemplo
    console.log('Creando usuario de ejemplo...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['demo@swallet.com']
    );

    let userId;
    if (existingUser.rows.length === 0) {
    const userResult = await client.query(
      `INSERT INTO users ("firstName", "lastName", email, password, "isActive", "isEmailVerified", balance, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id`,
      ['Demo', 'User', 'demo@swallet.com', hashedPassword, true, true, 1000.00]
    );
      userId = userResult.rows[0].id;
      console.log(`Usuario demo creado con ID: ${userId}`);
    } else {
      userId = existingUser.rows[0].id;
      console.log(`Usuario demo ya existe con ID: ${userId}`);
    }

    // Crear wallets de ejemplo para el usuario demo
    console.log('Creando wallets de ejemplo...');
    
    const networks = ['bep20', 'stellar', 'ethereum'];
    for (const network of networks) {
      const existingWallet = await client.query(
        'SELECT id FROM wallets WHERE user_id = $1 AND network = $2',
        [userId, network]
      );

      if (existingWallet.rows.length === 0) {
        const { v4: uuidv4 } = require('uuid');
        const walletId = uuidv4();
        const address = `0x${Math.random().toString(16).substr(2, 40)}`; // Dirección simulada
        
        await client.query(
          `INSERT INTO wallets (id, wallet_id, user_id, network, address, private_key, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [walletId, walletId, userId, network, address, `private_key_${network}_${Date.now()}`]
        );
        console.log(`Wallet ${network} creada para usuario demo`);
      } else {
        console.log(`Wallet ${network} ya existe para usuario demo`);
      }
    }

    console.log('Datos de ejemplo inicializados correctamente');
    console.log('\nCredenciales de prueba:');
    console.log('Email: demo@swallet.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error inicializando datos:', error);
  } finally {
    await client.end();
  }
}

initSampleData();
