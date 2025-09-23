import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { BaseService } from './base.service';
import { CryptoService } from './crypto.service';
import { UsersService } from './users.service';

@Injectable()
export class WalletsService extends BaseService<Wallet> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly cryptoService: CryptoService,
    private readonly usersService: UsersService,
  ) {
    super(walletRepository);
  }

  async findByUserId(userId: number): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { user_id: userId } });
  }

  async findByAddress(address: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { address } });
  }

  async findByNetwork(network: string): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { network } });
  }

  async findByUserAndNetwork(userId: number, network: string): Promise<Wallet[]> {
    return this.walletRepository.find({ 
      where: { user_id: userId, network } 
    });
  }

  async findByAddressAndNetwork(address: string, network: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ 
      where: { address, network } 
    });
  }

  async getWalletWithTransactions(walletId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['transactions', 'balances'],
    });
  }

  async getWalletWithBalances(walletId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['balances', 'balances.token'],
    });
  }

  /**
   * Crea una nueva wallet para un usuario con generación automática de claves
   */
  async createWallet(userId: number, network: string, password?: string): Promise<Wallet & { originalPrivateKey?: string }> {
    // Verificar que el usuario existe
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el usuario no tenga ya una wallet en esta red
    const existingWallet = await this.findByUserAndNetwork(userId, network);
    if (existingWallet.length > 0) {
      throw new ConflictException('El usuario ya tiene una wallet en esta red');
    }

    // Generar claves criptográficas
    const keyPair = this.cryptoService.generateKeyPair();
    const walletId = this.cryptoService.generateWalletId();

    // Validar la dirección generada
    if (!this.cryptoService.validateWalletAddress(keyPair.address, network)) {
      throw new BadRequestException('Dirección de wallet inválida');
    }

    // Encriptar la clave privada si se proporciona contraseña
    let encryptedPrivateKey = null;
    if (password) {
      encryptedPrivateKey = this.cryptoService.encryptPrivateKey(keyPair.privateKey, password);
    }

    const wallet = this.walletRepository.create({
      wallet_id: walletId,
      user_id: userId,
      network,
      address: keyPair.address,
      private_key: password ? null : keyPair.privateKey, // Solo guardar en texto plano si no hay contraseña
      encrypted_private_key: encryptedPrivateKey,
    });

    const savedWallet = await this.walletRepository.save(wallet);
    
    // Agregar la clave privada original para devolverla en la respuesta de creación
    return {
      ...savedWallet,
      originalPrivateKey: keyPair.privateKey
    };
  }

  /**
   * Recupera una wallet usando la clave privada
   */
  async recoverWallet(privateKey: string, network: string, userId: number): Promise<Wallet> {
    // Validar la clave privada
    if (!this.cryptoService.validatePrivateKey(privateKey)) {
      throw new BadRequestException('Clave privada inválida');
    }

    // Generar la dirección desde la clave privada
    const keyPair = this.cryptoService.generateKeyPair();
    const address = this.cryptoService.generateWalletAddress(privateKey);

    // Verificar que no existe ya una wallet con esta dirección
    const existingWallet = await this.findByAddressAndNetwork(address, network);
    if (existingWallet) {
      throw new ConflictException('Ya existe una wallet con esta dirección');
    }

    const walletId = this.cryptoService.generateWalletId();

    const wallet = this.walletRepository.create({
      wallet_id: walletId,
      user_id: userId,
      network,
      address,
      private_key: privateKey,
      encrypted_private_key: null,
    });

    return this.walletRepository.save(wallet);
  }

  /**
   * Obtiene la clave privada de una wallet (requiere contraseña si está encriptada)
   */
  async getPrivateKey(walletId: string, password?: string): Promise<string> {
    const wallet = await this.findById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet no encontrada');
    }

    if (wallet.private_key) {
      return wallet.private_key;
    }

    if (wallet.encrypted_private_key && password) {
      try {
        return this.cryptoService.decryptPrivateKey(wallet.encrypted_private_key, password);
      } catch (error) {
        throw new BadRequestException('Contraseña incorrecta');
      }
    }

    throw new BadRequestException('No se puede acceder a la clave privada');
  }

  /**
   * Busca una wallet por su ID único
   */
  async findByWalletId(walletId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { wallet_id: walletId } });
  }

  /**
   * Busca una wallet por dirección de email del usuario
   */
  async findByUserEmail(email: string, network?: string): Promise<Wallet[]> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return [];
    }

    if (network) {
      return this.findByUserAndNetwork(user.id, network);
    }

    return this.findByUserId(user.id);
  }

  /**
   * Actualiza la contraseña de encriptación de una wallet
   */
  async updateWalletPassword(walletId: string, oldPassword: string, newPassword: string): Promise<Wallet> {
    const wallet = await this.findById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet no encontrada');
    }

    if (!wallet.encrypted_private_key) {
      throw new BadRequestException('La wallet no tiene clave privada encriptada');
    }

    try {
      // Desencriptar con la contraseña antigua
      const privateKey = this.cryptoService.decryptPrivateKey(wallet.encrypted_private_key, oldPassword);
      
      // Encriptar con la nueva contraseña
      const newEncryptedPrivateKey = this.cryptoService.encryptPrivateKey(privateKey, newPassword);
      
      // Actualizar en la base de datos
      await this.walletRepository.update(walletId, {
        encrypted_private_key: newEncryptedPrivateKey
      });

      return this.findById(walletId);
    } catch (error) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }
  }

  /**
   * Elimina la clave privada de una wallet (por seguridad)
   */
  async removePrivateKey(walletId: string): Promise<Wallet> {
    const wallet = await this.findById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet no encontrada');
    }

    await this.walletRepository.update(walletId, { 
      private_key: null,
      encrypted_private_key: null 
    });
    
    return this.findById(walletId);
  }
}
