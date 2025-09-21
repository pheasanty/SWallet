import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { NetworkSettingsService } from '../../services/network-settings.service';

@Controller('networks')
export class NetworksController {
  constructor(private readonly networkSettingsService: NetworkSettingsService) {}

  @Get()
  async findAll() {
    return this.networkSettingsService.findAll();
  }

  @Get('active')
  async findActiveNetworks() {
    return this.networkSettingsService.findActiveNetworks();
  }

  @Get('supported')
  async getSupportedNetworks() {
    return this.networkSettingsService.getSupportedNetworks();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.networkSettingsService.findById(id);
  }

  @Get('name/:networkName')
  async findByNetworkName(@Param('networkName') networkName: string) {
    return this.networkSettingsService.findByNetworkName(networkName);
  }

  @Get('chain/:chainId')
  async findByChainId(@Param('chainId') chainId: number) {
    return this.networkSettingsService.findByChainId(chainId);
  }

  @Get('rpc/:rpcUrl')
  async getNetworkByRpcUrl(@Param('rpcUrl') rpcUrl: string) {
    return this.networkSettingsService.getNetworkByRpcUrl(rpcUrl);
  }

  @Get('config/:networkName')
  async getNetworkConfig(@Param('networkName') networkName: string) {
    return this.networkSettingsService.getNetworkConfig(networkName);
  }

  @Get(':id/recommended-gas-price')
  async getRecommendedGasPrice(@Param('id') id: number) {
    return this.networkSettingsService.getRecommendedGasPrice(id);
  }

  @Post()
  async createNetworkSetting(@Body() body: {
    networkName: string;
    rpcUrl: string;
    chainId?: number;
    blockExplorerUrl?: string;
    gasLimit?: number;
    minGasPrice?: number;
    maxGasPrice?: number;
  }) {
    const {
      networkName,
      rpcUrl,
      chainId,
      blockExplorerUrl,
      gasLimit = 21000,
      minGasPrice = 1,
      maxGasPrice = 1000000000,
    } = body;

    return this.networkSettingsService.createNetworkSetting(
      networkName,
      rpcUrl,
      chainId,
      blockExplorerUrl,
      gasLimit,
      minGasPrice,
      maxGasPrice
    );
  }

  @Put(':id/rpc-url')
  async updateRpcUrl(
    @Param('id') id: number,
    @Body() body: { rpcUrl: string }
  ) {
    return this.networkSettingsService.updateRpcUrl(id, body.rpcUrl);
  }

  @Put(':id/gas-settings')
  async updateGasSettings(
    @Param('id') id: number,
    @Body() body: { gasLimit?: number; minGasPrice?: number; maxGasPrice?: number }
  ) {
    const { gasLimit, minGasPrice, maxGasPrice } = body;
    return this.networkSettingsService.updateGasSettings(id, gasLimit, minGasPrice, maxGasPrice);
  }

  @Put(':id/block-explorer')
  async updateBlockExplorerUrl(
    @Param('id') id: number,
    @Body() body: { blockExplorerUrl: string }
  ) {
    return this.networkSettingsService.updateBlockExplorerUrl(id, body.blockExplorerUrl);
  }

  @Put(':id/activate')
  async activateNetwork(@Param('id') id: number) {
    return this.networkSettingsService.activateNetwork(id);
  }

  @Put(':id/deactivate')
  async deactivateNetwork(@Param('id') id: number) {
    return this.networkSettingsService.deactivateNetwork(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateNetworkDto: any) {
    return this.networkSettingsService.update(id, updateNetworkDto);
  }

  @Post(':id/validate-gas-price')
  async validateGasPrice(
    @Param('id') id: number,
    @Body() body: { gasPrice: number }
  ) {
    const isValid = await this.networkSettingsService.validateGasPrice(id, body.gasPrice);
    return { isValid, gasPrice: body.gasPrice };
  }
}
