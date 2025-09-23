import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { WalletsService } from '../../services/wallets.service';
import { CryptoService } from '../../services/crypto.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export class CreateWalletDto {
  network: string;
  password?: string;
}

export class RecoverWalletDto {
  privateKey: string;
  network: string;
}

export class GetPrivateKeyDto {
  password?: string;
}

export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly cryptoService: CryptoService,
  ) {}

  /**
   * Crear una nueva wallet para el usuario autenticado
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWallet(@Request() req, @Body() createWalletDto: CreateWalletDto) {
    const userId = req.user.id;
    const { network, password } = createWalletDto;

    // Validar la red
    if (!['bep20', 'stellar', 'ethereum'].includes(network.toLowerCase())) {
      throw new Error('Red no soportada');
    }

    const wallet = await this.walletsService.createWallet(userId, network, password);
    
    // En la creación, devolver la clave privada para que el usuario la pueda ver y guardar
    const { private_key, encrypted_private_key, originalPrivateKey, ...safeWallet } = wallet;
    
    return {
      success: true,
      message: 'Wallet creada exitosamente',
      data: {
        ...safeWallet,
        privateKey: originalPrivateKey || private_key, // Devolver la clave privada original o la guardada
        hasPrivateKey: !!private_key || !!encrypted_private_key
      }
    };
  }

  /**
   * Recuperar una wallet existente usando clave privada
   */
  @Post('recover')
  @HttpCode(HttpStatus.CREATED)
  async recoverWallet(@Request() req, @Body() recoverWalletDto: RecoverWalletDto) {
    const userId = req.user.id;
    const { privateKey, network } = recoverWalletDto;

    const wallet = await this.walletsService.recoverWallet(privateKey, network, userId);
    
    // No devolver la clave privada en la respuesta por seguridad
    const { private_key, encrypted_private_key, ...safeWallet } = wallet;
    
    return {
      success: true,
      message: 'Wallet recuperada exitosamente',
      data: {
        ...safeWallet,
        hasPrivateKey: !!private_key || !!encrypted_private_key
      }
    };
  }

  /**
   * Obtener la clave privada de una wallet específica
   */
  @Post(':walletId/private-key')
  @HttpCode(HttpStatus.OK)
  async getPrivateKey(
    @Request() req,
    @Param('walletId') walletId: string,
    @Body() getPrivateKeyDto: GetPrivateKeyDto
  ) {
    const userId = req.user.id;
    const { password } = getPrivateKeyDto;

    // Verificar que la wallet pertenece al usuario
    const wallet = await this.walletsService.findById(walletId);
    if (!wallet || wallet.user_id !== userId) {
      throw new NotFoundException('Wallet no encontrada');
    }

    try {
      const privateKey = await this.walletsService.getPrivateKey(walletId, password);
      
      return {
        success: true,
        message: 'Clave privada obtenida exitosamente',
        data: {
          privateKey,
          walletId: wallet.wallet_id,
          address: wallet.address,
          network: wallet.network
        }
      };
    } catch (error) {
      if (error.message.includes('contraseña')) {
        throw new BadRequestException('Contraseña incorrecta');
      }
      throw error;
    }
  }

  /**
   * Obtener todas las wallets del usuario autenticado
   */
  @Get()
  async getUserWallets(@Request() req, @Query('network') network?: string) {
    const userId = req.user.id;
    
    let wallets;
    if (network) {
      wallets = await this.walletsService.findByUserAndNetwork(userId, network);
    } else {
      wallets = await this.walletsService.findByUserId(userId);
    }

    // Filtrar información sensible
    const safeWallets = wallets.map(wallet => {
      const { private_key, encrypted_private_key, ...safeWallet } = wallet;
      return {
        ...safeWallet,
        hasPrivateKey: !!private_key || !!encrypted_private_key
      };
    });

    return {
      success: true,
      data: safeWallets
    };
  }

  /**
   * Obtener una wallet específica por ID
   */
  @Get(':walletId')
  async getWallet(@Param('walletId') walletId: string, @Request() req) {
    const userId = req.user.id;
    const wallet = await this.walletsService.findByWalletId(walletId);
    
    if (!wallet) {
      throw new Error('Wallet no encontrada');
    }

    // Verificar que la wallet pertenece al usuario
    if (wallet.user_id !== userId) {
      throw new Error('No tienes permisos para acceder a esta wallet');
    }

    // Filtrar información sensible
    const { private_key, encrypted_private_key, ...safeWallet } = wallet;
    
    return {
      success: true,
      data: {
        ...safeWallet,
        hasPrivateKey: !!private_key || !!encrypted_private_key
      }
    };
  }


  /**
   * Actualizar la contraseña de encriptación de una wallet
   */
  @Put(':walletId/password')
  async updatePassword(
    @Param('walletId') walletId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const wallet = await this.walletsService.findByWalletId(walletId);
    
    if (!wallet) {
      throw new Error('Wallet no encontrada');
    }

    // Verificar que la wallet pertenece al usuario
    if (wallet.user_id !== userId) {
      throw new Error('No tienes permisos para acceder a esta wallet');
    }

    const updatedWallet = await this.walletsService.updateWalletPassword(
      walletId,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword
    );

    // Filtrar información sensible
    const { private_key, encrypted_private_key, ...safeWallet } = updatedWallet;
    
    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
      data: {
        ...safeWallet,
        hasPrivateKey: !!private_key || !!encrypted_private_key
      }
    };
  }

  /**
   * Eliminar la clave privada de una wallet (por seguridad)
   */
  @Delete(':walletId/private-key')
  async removePrivateKey(@Param('walletId') walletId: string, @Request() req) {
    const userId = req.user.id;
    const wallet = await this.walletsService.findByWalletId(walletId);
    
    if (!wallet) {
      throw new Error('Wallet no encontrada');
    }

    // Verificar que la wallet pertenece al usuario
    if (wallet.user_id !== userId) {
      throw new Error('No tienes permisos para acceder a esta wallet');
    }

    const updatedWallet = await this.walletsService.removePrivateKey(walletId);
    
    // Filtrar información sensible
    const { private_key, encrypted_private_key, ...safeWallet } = updatedWallet;
    
    return {
      success: true,
      message: 'Clave privada eliminada exitosamente',
      data: {
        ...safeWallet,
        hasPrivateKey: false
      }
    };
  }

  /**
   * Buscar wallet por dirección de email
   */
  @Get('search/by-email')
  async searchByEmail(@Query('email') email: string, @Query('network') network?: string) {
    if (!email) {
      throw new Error('Email es requerido');
    }

    const wallets = await this.walletsService.findByUserEmail(email, network);
    
    // Filtrar información sensible
    const safeWallets = wallets.map(wallet => {
      const { private_key, encrypted_private_key, ...safeWallet } = wallet;
      return {
        ...safeWallet,
        hasPrivateKey: !!private_key || !!encrypted_private_key
      };
    });

    return {
      success: true,
      data: safeWallets
    };
  }

  /**
   * Validar una dirección de wallet
   */
  @Post('validate-address')
  async validateAddress(@Body() body: { address: string; network: string }) {
    const { address, network } = body;
    
    const isValid = this.cryptoService.validateWalletAddress(address, network);
    
    return {
      success: true,
      data: {
        address,
        network,
        isValid
      }
    };
  }
}