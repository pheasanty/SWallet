-- Script para insertar tokens de ejemplo en la base de datos
-- Ejecutar después de las migraciones

-- Insertar tokens para BEP20 (Binance Smart Chain)
INSERT INTO tokens (symbol, name, contract_address, network, decimals, is_active, logo_url, created_at) VALUES
('BNB', 'Binance Coin', '0x0000000000000000000000000000000000000000', 'bep20', 18, true, 'https://cryptologos.cc/logos/bnb-bnb-logo.png', NOW()),
('USDT', 'Tether USD', '0x55d398326f99059fF775485246999027B3197955', 'bep20', 18, true, 'https://cryptologos.cc/logos/tether-usdt-logo.png', NOW()),
('USDC', 'USD Coin', '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 'bep20', 18, true, 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', NOW()),
('BUSD', 'Binance USD', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 'bep20', 18, true, 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', NOW()),
('ETH', 'Ethereum', '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 'bep20', 18, true, 'https://cryptologos.cc/logos/ethereum-eth-logo.png', NOW()),
('BTCB', 'Bitcoin BEP2', '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 'bep20', 18, true, 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', NOW());

-- Insertar tokens para Stellar
INSERT INTO tokens (symbol, name, contract_address, network, decimals, is_active, logo_url, created_at) VALUES
('XLM', 'Stellar Lumens', NULL, 'stellar', 7, true, 'https://cryptologos.cc/logos/stellar-xlm-logo.png', NOW()),
('USDC', 'USD Coin', 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', 'stellar', 7, true, 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', NOW()),
('USDT', 'Tether USD', 'GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZCCVT6K', 'stellar', 7, true, 'https://cryptologos.cc/logos/tether-usdt-logo.png', NOW());

-- Insertar tokens para Ethereum
INSERT INTO tokens (symbol, name, contract_address, network, decimals, is_active, logo_url, created_at) VALUES
('ETH', 'Ethereum', '0x0000000000000000000000000000000000000000', 'ethereum', 18, true, 'https://cryptologos.cc/logos/ethereum-eth-logo.png', NOW()),
('USDT', 'Tether USD', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'ethereum', 6, true, 'https://cryptologos.cc/logos/tether-usdt-logo.png', NOW()),
('USDC', 'USD Coin', '0xA0b86a33E6441b8c4C8C0E4b8c4C8C0E4b8c4C8C', 'ethereum', 6, true, 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', NOW()),
('WBTC', 'Wrapped Bitcoin', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 'ethereum', 8, true, 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', NOW());

-- Verificar que los tokens se insertaron correctamente
SELECT * FROM tokens ORDER BY network, symbol;
