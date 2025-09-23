# Ejemplos de Fetch para Frontend - SWallet API

Este documento contiene ejemplos completos de cómo usar la API de SWallet desde el frontend usando fetch.

## Configuración Base

```javascript
// Configuración base para todas las peticiones
const API_BASE_URL = 'http://localhost:3000'; // Cambiar por tu URL de producción

// Función helper para hacer peticiones autenticadas
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken'); // Obtener token del localStorage
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }
  
  return response.json();
}
```

## 1. Autenticación

### Login
```javascript
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('authToken', data.data.token);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

// Uso
login('usuario@ejemplo.com', 'password123')
  .then(user => console.log('Usuario logueado:', user))
  .catch(error => console.error('Error:', error));
```

### Registro
```javascript
async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
}

// Uso
register({
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan@ejemplo.com',
  password: 'password123',
  phone: '+1234567890'
})
  .then(user => console.log('Usuario registrado:', user))
  .catch(error => console.error('Error:', error));
```

## 2. Gestión de Wallets

### Crear una nueva wallet
```javascript
async function createWallet(network, password = null) {
  try {
    const response = await apiRequest('/wallets', {
      method: 'POST',
      body: JSON.stringify({
        network, // 'bep20', 'stellar', 'ethereum'
        password // Opcional, para encriptar la clave privada
      }),
    });

    return response.data;
  } catch (error) {
    console.error('Error creando wallet:', error);
    throw error;
  }
}

// Uso
createWallet('bep20', 'miPasswordSegura')
  .then(wallet => {
    console.log('Wallet creada:', wallet);
    console.log('ID de la wallet:', wallet.wallet_id);
    console.log('Dirección:', wallet.address);
  })
  .catch(error => console.error('Error:', error));
```

### Recuperar wallet con clave privada
```javascript
async function recoverWallet(privateKey, network) {
  try {
    const response = await apiRequest('/wallets/recover', {
      method: 'POST',
      body: JSON.stringify({
        privateKey,
        network
      }),
    });

    return response.data;
  } catch (error) {
    console.error('Error recuperando wallet:', error);
    throw error;
  }
}

// Uso
recoverWallet('tu_clave_privada_aqui', 'bep20')
  .then(wallet => {
    console.log('Wallet recuperada:', wallet);
  })
  .catch(error => console.error('Error:', error));
```

### Obtener todas las wallets del usuario
```javascript
async function getUserWallets(network = null) {
  try {
    const endpoint = network ? `/wallets?network=${network}` : '/wallets';
    const response = await apiRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo wallets:', error);
    throw error;
  }
}

// Uso
getUserWallets()
  .then(wallets => {
    console.log('Wallets del usuario:', wallets);
    wallets.forEach(wallet => {
      console.log(`- ${wallet.network}: ${wallet.address}`);
    });
  })
  .catch(error => console.error('Error:', error));

// Obtener solo wallets de una red específica
getUserWallets('bep20')
  .then(wallets => console.log('Wallets BEP20:', wallets))
  .catch(error => console.error('Error:', error));
```

### Obtener una wallet específica
```javascript
async function getWallet(walletId) {
  try {
    const response = await apiRequest(`/wallets/${walletId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo wallet:', error);
    throw error;
  }
}

// Uso
getWallet('uuid-de-la-wallet')
  .then(wallet => {
    console.log('Wallet:', wallet);
  })
  .catch(error => console.error('Error:', error));
```

### Obtener clave privada de una wallet
```javascript
async function getPrivateKey(walletId, password = null) {
  try {
    const response = await apiRequest(`/wallets/${walletId}/private-key`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    return response.data;
  } catch (error) {
    console.error('Error obteniendo clave privada:', error);
    throw error;
  }
}

// Uso
getPrivateKey('uuid-de-la-wallet', 'miPasswordSegura')
  .then(data => {
    console.log('Clave privada:', data.privateKey);
    console.log('Advertencia:', data.warning);
  })
  .catch(error => console.error('Error:', error));
```

### Buscar wallet por email
```javascript
async function searchWalletByEmail(email, network = null) {
  try {
    const endpoint = network 
      ? `/wallets/search/by-email?email=${email}&network=${network}`
      : `/wallets/search/by-email?email=${email}`;
    
    const response = await apiRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error buscando wallet:', error);
    throw error;
  }
}

// Uso
searchWalletByEmail('destinatario@ejemplo.com', 'bep20')
  .then(wallets => {
    console.log('Wallets encontradas:', wallets);
  })
  .catch(error => console.error('Error:', error));
```

### Validar dirección de wallet
```javascript
async function validateWalletAddress(address, network) {
  try {
    const response = await apiRequest('/wallets/validate-address', {
      method: 'POST',
      body: JSON.stringify({ address, network }),
    });

    return response.data;
  } catch (error) {
    console.error('Error validando dirección:', error);
    throw error;
  }
}

// Uso
validateWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'bep20')
  .then(result => {
    console.log('Dirección válida:', result.isValid);
  })
  .catch(error => console.error('Error:', error));
```

## 3. Transferencias

### Realizar una transferencia
```javascript
async function transfer(transferData) {
  try {
    const response = await apiRequest('/transfers', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });

    return response.data;
  } catch (error) {
    console.error('Error en transferencia:', error);
    throw error;
  }
}

// Ejemplo 1: Transferir por dirección
transfer({
  fromWalletId: 'uuid-de-tu-wallet',
  toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  amount: 100.5,
  tokenSymbol: 'USDT',
  network: 'bep20',
  password: 'miPasswordSegura', // O privateKey: 'tu_clave_privada'
  memo: 'Pago de servicios'
})
  .then(result => {
    console.log('Transferencia exitosa:', result);
    console.log('Hash de transacción:', result.txHash);
    console.log('Estado:', result.status);
  })
  .catch(error => console.error('Error:', error));

// Ejemplo 2: Transferir por email
transfer({
  fromWalletId: 'uuid-de-tu-wallet',
  toEmail: 'destinatario@ejemplo.com',
  amount: 50.0,
  tokenSymbol: 'BNB',
  network: 'bep20',
  privateKey: 'tu_clave_privada_aqui'
})
  .then(result => {
    console.log('Transferencia exitosa:', result);
  })
  .catch(error => console.error('Error:', error));
```

### Obtener saldo de una wallet
```javascript
async function getWalletBalance(walletId, tokenId) {
  try {
    const response = await apiRequest(`/transfers/balance/${walletId}/${tokenId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo saldo:', error);
    throw error;
  }
}

// Uso
getWalletBalance('uuid-de-la-wallet', 1) // tokenId = 1 para USDT
  .then(balance => {
    console.log('Saldo:', balance.balance);
  })
  .catch(error => console.error('Error:', error));
```

### Obtener todos los balances de una wallet
```javascript
async function getWalletBalances(walletId) {
  try {
    const response = await apiRequest(`/transfers/balances/${walletId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo balances:', error);
    throw error;
  }
}

// Uso
getWalletBalances('uuid-de-la-wallet')
  .then(data => {
    console.log('Balances de la wallet:', data.balances);
    data.balances.forEach(balance => {
      console.log(`${balance.tokenSymbol}: ${balance.balance}`);
    });
  })
  .catch(error => console.error('Error:', error));
```

### Obtener historial de transacciones
```javascript
async function getTransactionHistory(walletId, limit = 50) {
  try {
    const response = await apiRequest(`/transfers/history/${walletId}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
}

// Uso
getTransactionHistory('uuid-de-la-wallet', 20)
  .then(data => {
    console.log('Historial de transacciones:', data.transactions);
    data.transactions.forEach(tx => {
      console.log(`${tx.amount} ${tx.tokenSymbol} - ${tx.status} - ${tx.createdAt}`);
    });
  })
  .catch(error => console.error('Error:', error));
```

### Obtener transacción por hash
```javascript
async function getTransactionByHash(txHash) {
  try {
    const response = await apiRequest(`/transfers/transaction/${txHash}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo transacción:', error);
    throw error;
  }
}

// Uso
getTransactionByHash('hash-de-la-transaccion')
  .then(transaction => {
    console.log('Transacción:', transaction);
  })
  .catch(error => console.error('Error:', error));
```

### Validar transferencia antes de enviar
```javascript
async function validateTransfer(transferData) {
  try {
    const response = await apiRequest('/transfers/validate', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });

    return response.data;
  } catch (error) {
    console.error('Error validando transferencia:', error);
    throw error;
  }
}

// Uso
validateTransfer({
  fromWalletId: 'uuid-de-tu-wallet',
  toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  amount: 100.5,
  tokenSymbol: 'USDT',
  network: 'bep20',
  password: 'miPasswordSegura'
})
  .then(result => {
    if (result.isValid) {
      console.log('Transferencia válida, proceder con el envío');
    } else {
      console.log('Errores encontrados:', result.errors);
    }
  })
  .catch(error => console.error('Error:', error));
```

## 4. Ejemplo de Aplicación Completa

```javascript
class SWalletAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }
    
    return response.json();
  }

  // Autenticación
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  }

  // Wallets
  async createWallet(network, password = null) {
    const response = await this.request('/wallets', {
      method: 'POST',
      body: JSON.stringify({ network, password }),
    });
    return response.data;
  }

  async getUserWallets(network = null) {
    const endpoint = network ? `/wallets?network=${network}` : '/wallets';
    const response = await this.request(endpoint);
    return response.data;
  }

  // Transferencias
  async transfer(transferData) {
    const response = await this.request('/transfers', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
    return response.data;
  }

  async getWalletBalances(walletId) {
    const response = await this.request(`/transfers/balances/${walletId}`);
    return response.data;
  }
}

// Uso de la clase
const api = new SWalletAPI();

// Ejemplo de flujo completo
async function ejemploCompleto() {
  try {
    // 1. Login
    const user = await api.login('usuario@ejemplo.com', 'password123');
    console.log('Usuario logueado:', user);

    // 2. Crear wallet
    const wallet = await api.createWallet('bep20', 'miPasswordSegura');
    console.log('Wallet creada:', wallet);

    // 3. Obtener wallets del usuario
    const wallets = await api.getUserWallets();
    console.log('Wallets del usuario:', wallets);

    // 4. Obtener balances
    const balances = await api.getWalletBalances(wallet.id);
    console.log('Balances:', balances);

    // 5. Realizar transferencia
    const transferResult = await api.transfer({
      fromWalletId: wallet.id,
      toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      amount: 10.0,
      tokenSymbol: 'USDT',
      network: 'bep20',
      password: 'miPasswordSegura'
    });
    console.log('Transferencia exitosa:', transferResult);

  } catch (error) {
    console.error('Error en el flujo:', error);
  }
}

// Ejecutar ejemplo
ejemploCompleto();
```

## 5. Manejo de Errores

```javascript
// Función helper para manejo de errores
function handleAPIError(error) {
  if (error.message.includes('Token inválido')) {
    // Token expirado o inválido
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  } else if (error.message.includes('Saldo insuficiente')) {
    // Mostrar mensaje de saldo insuficiente
    alert('No tienes suficiente saldo para realizar esta transacción');
  } else if (error.message.includes('Wallet no encontrada')) {
    // Wallet no existe
    alert('La wallet especificada no existe');
  } else {
    // Error genérico
    console.error('Error de API:', error);
    alert('Ocurrió un error inesperado');
  }
}

// Uso con manejo de errores
transfer({
  fromWalletId: 'uuid-de-tu-wallet',
  toAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  amount: 100.0,
  tokenSymbol: 'USDT',
  network: 'bep20',
  password: 'miPasswordSegura'
})
  .then(result => {
    console.log('Transferencia exitosa:', result);
  })
  .catch(error => {
    handleAPIError(error);
  });
```

## Notas Importantes

1. **Seguridad**: Nunca almacenes claves privadas en el frontend. Siempre usa contraseñas para encriptar las claves privadas.

2. **Tokens de Autenticación**: Los tokens JWT tienen una duración limitada. Implementa renovación automática de tokens.

3. **Validación**: Siempre valida los datos antes de enviarlos a la API.

4. **Manejo de Estados**: Implementa estados de carga y error en tu UI para mejorar la experiencia del usuario.

5. **Rate Limiting**: La API puede tener límites de velocidad. Implementa retry logic si es necesario.

6. **HTTPS**: En producción, siempre usa HTTPS para proteger las comunicaciones.

7. **Variables de Entorno**: Usa variables de entorno para configurar la URL de la API en diferentes entornos.
