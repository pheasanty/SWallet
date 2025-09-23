import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;

  /**
   * Genera un par de claves (privada y pública) para una wallet
   */
  generateKeyPair(): { privateKey: string; publicKey: string; address: string } {
    // Generar clave privada aleatoria de 32 bytes
    const privateKey = crypto.randomBytes(32).toString('hex');
    
    // Generar clave pública desde la privada (simplificado para demo)
    // En un entorno real, usarías las librerías específicas de cada blockchain
    const publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
    
    // Generar dirección de wallet (simplificado)
    const address = this.generateWalletAddress(privateKey);
    
    return {
      privateKey,
      publicKey,
      address
    };
  }

  /**
   * Genera una dirección de wallet única
   */
  generateWalletAddress(privateKey: string): string {
    const hash = crypto.createHash('sha256').update(privateKey + Date.now()).digest('hex');
    return '0x' + hash.substring(0, 40);
  }

  /**
   * Encripta una clave privada con una contraseña
   */
  encryptPrivateKey(privateKey: string, password: string): string {
    const encrypted = CryptoJS.AES.encrypt(privateKey, password).toString();
    return encrypted;
  }

  /**
   * Desencripta una clave privada con una contraseña
   */
  decryptPrivateKey(encryptedPrivateKey: string, password: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Genera un UUID único para la wallet
   */
  generateWalletId(): string {
    return uuidv4();
  }

  /**
   * Valida si una dirección de wallet tiene el formato correcto
   */
  validateWalletAddress(address: string, network: string): boolean {
    switch (network.toLowerCase()) {
      case 'bep20':
      case 'ethereum':
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      case 'stellar':
        return /^G[A-Z0-9]{55}$/.test(address);
      default:
        return address.length >= 20 && address.length <= 100;
    }
  }

  /**
   * Genera un hash seguro para transacciones
   */
  generateTransactionHash(data: string): string {
    return crypto.createHash('sha256').update(data + Date.now()).digest('hex');
  }

  /**
   * Verifica la integridad de una clave privada
   */
  validatePrivateKey(privateKey: string): boolean {
    return /^[a-fA-F0-9]{64}$/.test(privateKey);
  }
}
