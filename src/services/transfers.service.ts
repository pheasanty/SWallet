import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Wallet } from '../entities/wallet.entity';
import { WalletBalance } from '../entities/wallet-balance.entity';
import { Token } from '../entities/token.entity';
import { WalletsService } from './wallets.service';
import { CryptoService } from './crypto.service';
import { UsersService } from './users.service';

export interface TransferRequest {
  fromWalletId: string;
  toAddress: string;
  toEmail?: string;
  amount: number;
  tokenSymbol: string;
  network: string;
  privateKey?: string;
  password?: string;
  memo?: string;
}

export interface TransferResult {
  transaction: Transaction;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  message: string;
}

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(WalletBalance)
    private readonly walletBalanceRepository: Repository<WalletBalance>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly walletsService: WalletsService,
    private readonly cryptoService: CryptoService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Realiza una transferencia entre wallets
   */
  async transfer(transferRequest: TransferRequest): Promise<TransferResult> {
    const { fromWalletId, toAddress, toEmail, amount, tokenSymbol, network, privateKey, password, memo } = transferRequest;

    // Validar que la cantidad sea positiva
    if (amount <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    // Obtener la wallet de origen
    const fromWallet = await this.walletsService.findByWalletId(fromWalletId);
    if (!fromWallet) {
      throw new NotFoundException('Wallet de origen no encontrada');
    }

    // Verificar que la wallet de origen pertenece a la red especificada
    if (fromWallet.network !== network) {
      throw new BadRequestException('La wallet de origen no pertenece a la red especificada');
    }

    // Obtener el token
    const token = await this.tokenRepository.findOne({
      where: { symbol: tokenSymbol, network, is_active: true }
    });
    if (!token) {
      throw new NotFoundException('Token no encontrado o inactivo');
    }

    // Determinar la dirección de destino
    let destinationAddress = toAddress;
    if (toEmail && !toAddress) {
      const destinationWallets = await this.walletsService.findByUserEmail(toEmail, network);
      if (destinationWallets.length === 0) {
        throw new NotFoundException('No se encontró una wallet para el email especificado');
      }
      destinationAddress = destinationWallets[0].address;
    }

    // Validar la dirección de destino
    if (!this.cryptoService.validateWalletAddress(destinationAddress, network)) {
      throw new BadRequestException('Dirección de destino inválida');
    }

    // Verificar que no se esté enviando a la misma wallet
    if (fromWallet.address === destinationAddress) {
      throw new BadRequestException('No puedes enviar tokens a tu propia wallet');
    }

    // Verificar el saldo disponible
    const senderBalance = await this.getWalletBalance(fromWalletId, token.id);
    if (senderBalance < amount) {
      throw new BadRequestException('Saldo insuficiente');
    }

    // Obtener la clave privada si es necesaria
    let walletPrivateKey = privateKey;
    if (!walletPrivateKey) {
      walletPrivateKey = await this.walletsService.getPrivateKey(fromWalletId, password);
    }

    // Validar la clave privada
    if (!this.cryptoService.validatePrivateKey(walletPrivateKey)) {
      throw new BadRequestException('Clave privada inválida');
    }

    // Generar hash de transacción
    const txHash = this.cryptoService.generateTransactionHash(
      `${fromWallet.address}-${destinationAddress}-${amount}-${Date.now()}`
    );

    // Crear la transacción
    const transaction = this.transactionRepository.create({
      wallet_id: fromWalletId,
      tx_hash: txHash,
      amount,
      to_address: destinationAddress,
      status: 'pending',
      network,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    try {
      // Simular el proceso de transferencia (en un entorno real, aquí se haría la transacción en blockchain)
      const transferResult = await this.simulateBlockchainTransfer(
        fromWallet,
        destinationAddress,
        amount,
        token,
        walletPrivateKey
      );

      // Actualizar el estado de la transacción
      await this.transactionRepository.update(savedTransaction.id, {
        status: transferResult.success ? 'confirmed' : 'failed'
      });

      // Actualizar balances si la transacción fue exitosa
      if (transferResult.success) {
        await this.updateBalances(fromWalletId, destinationAddress, amount, token.id);
      }

      return {
        transaction: savedTransaction,
        txHash,
        status: transferResult.success ? 'confirmed' : 'failed',
        message: transferResult.message
      };

    } catch (error) {
      // Marcar la transacción como fallida
      await this.transactionRepository.update(savedTransaction.id, {
        status: 'failed'
      });

      throw new BadRequestException(`Error en la transferencia: ${error.message}`);
    }
  }

  /**
   * Obtiene el saldo de una wallet para un token específico
   */
  async getWalletBalance(walletId: string, tokenId: number): Promise<number> {
    const balance = await this.walletBalanceRepository.findOne({
      where: { wallet_id: walletId, token_id: tokenId }
    });
    return balance ? parseFloat(balance.balance.toString()) : 0;
  }

  /**
   * Obtiene todos los balances de una wallet
   */
  async getWalletBalances(walletId: string): Promise<WalletBalance[]> {
    return this.walletBalanceRepository.find({
      where: { wallet_id: walletId },
      relations: ['token']
    });
  }

  /**
   * Actualiza los balances después de una transferencia exitosa
   */
  private async updateBalances(
    fromWalletId: string,
    toAddress: string,
    amount: number,
    tokenId: number
  ): Promise<void> {
    // Reducir el saldo del remitente
    const senderBalance = await this.walletBalanceRepository.findOne({
      where: { wallet_id: fromWalletId, token_id: tokenId }
    });

    if (senderBalance) {
      const newSenderBalance = parseFloat(senderBalance.balance.toString()) - amount;
      await this.walletBalanceRepository.update(senderBalance.id, {
        balance: newSenderBalance,
        last_updated: new Date()
      });
    }

    // Aumentar el saldo del destinatario
    const toWallet = await this.walletsService.findByAddressAndNetwork(toAddress, 'bep20'); // Asumir red por ahora
    if (toWallet) {
      const receiverBalance = await this.walletBalanceRepository.findOne({
        where: { wallet_id: toWallet.id, token_id: tokenId }
      });

      if (receiverBalance) {
        const newReceiverBalance = parseFloat(receiverBalance.balance.toString()) + amount;
        await this.walletBalanceRepository.update(receiverBalance.id, {
          balance: newReceiverBalance,
          last_updated: new Date()
        });
      } else {
        // Crear nuevo balance si no existe
        const newBalance = this.walletBalanceRepository.create({
          wallet_id: toWallet.id,
          token_id: tokenId,
          balance: amount,
          last_updated: new Date()
        });
        await this.walletBalanceRepository.save(newBalance);
      }
    }
  }

  /**
   * Simula una transferencia en blockchain (en un entorno real, esto se conectaría con la red)
   */
  private async simulateBlockchainTransfer(
    fromWallet: Wallet,
    toAddress: string,
    amount: number,
    token: Token,
    privateKey: string
  ): Promise<{ success: boolean; message: string }> {
    // Simular validación de clave privada
    if (!this.cryptoService.validatePrivateKey(privateKey)) {
      return { success: false, message: 'Clave privada inválida' };
    }

    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular éxito (en un entorno real, aquí se haría la transacción real)
    return {
      success: true,
      message: `Transferencia exitosa de ${amount} ${token.symbol} a ${toAddress}`
    };
  }

  /**
   * Obtiene el historial de transacciones de una wallet
   */
  async getTransactionHistory(walletId: string, limit: number = 50): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { wallet_id: walletId },
      order: { created_at: 'DESC' },
      take: limit
    });
  }

  /**
   * Obtiene una transacción por su hash
   */
  async getTransactionByHash(txHash: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { tx_hash: txHash },
      relations: ['wallet']
    });
  }

  /**
   * Inicializa el saldo de un token para una wallet
   */
  async initializeTokenBalance(walletId: string, tokenId: number, initialBalance: number = 0): Promise<WalletBalance> {
    const existingBalance = await this.walletBalanceRepository.findOne({
      where: { wallet_id: walletId, token_id: tokenId }
    });

    if (existingBalance) {
      return existingBalance;
    }

    const balance = this.walletBalanceRepository.create({
      wallet_id: walletId,
      token_id: tokenId,
      balance: initialBalance,
      last_updated: new Date()
    });

    return this.walletBalanceRepository.save(balance);
  }
}
