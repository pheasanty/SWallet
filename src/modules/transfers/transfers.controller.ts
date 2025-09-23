import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransfersService, TransferRequest } from '../../services/transfers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export class TransferDto {
  fromWalletId: string;
  toAddress?: string;
  toEmail?: string;
  amount: number;
  tokenSymbol: string;
  network: string;
  privateKey?: string;
  password?: string;
  memo?: string;
}

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  /**
   * Realizar una transferencia
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async transfer(@Request() req, @Body() transferDto: TransferDto) {
    const userId = req.user.id;
    
    // Validar que se proporcione al menos una dirección de destino
    if (!transferDto.toAddress && !transferDto.toEmail) {
      throw new Error('Debe proporcionar una dirección de destino o un email');
    }

    // Validar que no se proporcionen ambas opciones
    if (transferDto.toAddress && transferDto.toEmail) {
      throw new Error('Proporcione solo una dirección de destino o un email, no ambos');
    }

    // Validar que se proporcione al menos una forma de autenticación
    if (!transferDto.privateKey && !transferDto.password) {
      throw new Error('Debe proporcionar una clave privada o contraseña');
    }

    const transferRequest: TransferRequest = {
      fromWalletId: transferDto.fromWalletId,
      toAddress: transferDto.toAddress,
      toEmail: transferDto.toEmail,
      amount: transferDto.amount,
      tokenSymbol: transferDto.tokenSymbol,
      network: transferDto.network,
      privateKey: transferDto.privateKey,
      password: transferDto.password,
      memo: transferDto.memo,
    };

    const result = await this.transfersService.transfer(transferRequest);
    
    return {
      success: true,
      message: result.message,
      data: {
        transactionId: result.transaction.id,
        txHash: result.txHash,
        status: result.status,
        amount: transferDto.amount,
        tokenSymbol: transferDto.tokenSymbol,
        network: transferDto.network,
        timestamp: result.transaction.created_at
      }
    };
  }

  /**
   * Obtener el saldo de una wallet para un token específico
   */
  @Get('balance/:walletId/:tokenId')
  async getBalance(
    @Param('walletId') walletId: string,
    @Param('tokenId') tokenId: number,
    @Request() req
  ) {
    const userId = req.user.id;
    
    // Verificar que la wallet pertenece al usuario (esto debería estar en el servicio)
    const balance = await this.transfersService.getWalletBalance(walletId, tokenId);
    
    return {
      success: true,
      data: {
        walletId,
        tokenId,
        balance
      }
    };
  }

  /**
   * Obtener todos los balances de una wallet
   */
  @Get('balances/:walletId')
  async getWalletBalances(@Param('walletId') walletId: string, @Request() req) {
    const userId = req.user.id;
    
    const balances = await this.transfersService.getWalletBalances(walletId);
    
    return {
      success: true,
      data: {
        walletId,
        balances: balances.map(balance => ({
          tokenId: balance.token_id,
          tokenSymbol: balance.token?.symbol,
          tokenName: balance.token?.name,
          balance: balance.balance,
          lastUpdated: balance.last_updated
        }))
      }
    };
  }

  /**
   * Obtener historial de transacciones de una wallet
   */
  @Get('history/:walletId')
  async getTransactionHistory(
    @Param('walletId') walletId: string,
    @Query('limit') limit: string = '50',
    @Request() req
  ) {
    const userId = req.user.id;
    const limitNumber = parseInt(limit, 10) || 50;
    
    const transactions = await this.transfersService.getTransactionHistory(walletId, limitNumber);
    
    return {
      success: true,
      data: {
        walletId,
        transactions: transactions.map(tx => ({
          id: tx.id,
          txHash: tx.tx_hash,
          amount: tx.amount,
          toAddress: tx.to_address,
          status: tx.status,
          network: tx.network,
          createdAt: tx.created_at
        }))
      }
    };
  }

  /**
   * Obtener una transacción por su hash
   */
  @Get('transaction/:txHash')
  async getTransactionByHash(@Param('txHash') txHash: string, @Request() req) {
    const userId = req.user.id;
    
    const transaction = await this.transfersService.getTransactionByHash(txHash);
    
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    return {
      success: true,
      data: {
        id: transaction.id,
        txHash: transaction.tx_hash,
        amount: transaction.amount,
        toAddress: transaction.to_address,
        status: transaction.status,
        network: transaction.network,
        createdAt: transaction.created_at,
        walletId: transaction.wallet_id
      }
    };
  }

  /**
   * Inicializar el saldo de un token para una wallet
   */
  @Post('initialize-balance')
  async initializeBalance(
    @Body() body: { walletId: string; tokenId: number; initialBalance?: number },
    @Request() req
  ) {
    const userId = req.user.id;
    const { walletId, tokenId, initialBalance = 0 } = body;
    
    const balance = await this.transfersService.initializeTokenBalance(walletId, tokenId, initialBalance);
    
    return {
      success: true,
      message: 'Saldo inicializado exitosamente',
      data: {
        walletId,
        tokenId,
        balance: balance.balance,
        lastUpdated: balance.last_updated
      }
    };
  }

  /**
   * Obtener información de transferencia (para validar antes de enviar)
   */
  @Post('validate')
  async validateTransfer(@Body() transferDto: TransferDto, @Request() req) {
    const userId = req.user.id;
    
    // Validaciones básicas
    const errors = [];
    
    if (!transferDto.fromWalletId) {
      errors.push('ID de wallet de origen es requerido');
    }
    
    if (!transferDto.toAddress && !transferDto.toEmail) {
      errors.push('Dirección de destino o email es requerido');
    }
    
    if (transferDto.amount <= 0) {
      errors.push('La cantidad debe ser mayor a 0');
    }
    
    if (!transferDto.tokenSymbol) {
      errors.push('Símbolo del token es requerido');
    }
    
    if (!transferDto.network) {
      errors.push('Red es requerida');
    }
    
    if (!transferDto.privateKey && !transferDto.password) {
      errors.push('Clave privada o contraseña es requerida');
    }

    return {
      success: errors.length === 0,
      data: {
        isValid: errors.length === 0,
        errors
      }
    };
  }
}
