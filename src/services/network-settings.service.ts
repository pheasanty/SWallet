import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NetworkSetting } from '../entities/network-setting.entity';
import { BaseService } from './base.service';

@Injectable()
export class NetworkSettingsService extends BaseService<NetworkSetting> {
  constructor(
    @InjectRepository(NetworkSetting)
    private readonly networkSettingRepository: Repository<NetworkSetting>,
  ) {
    super(networkSettingRepository);
  }

  async findByNetworkName(networkName: string): Promise<NetworkSetting | null> {
    return this.networkSettingRepository.findOne({ 
      where: { network_name: networkName } 
    });
  }

  async findByChainId(chainId: number): Promise<NetworkSetting | null> {
    return this.networkSettingRepository.findOne({ 
      where: { chain_id: chainId } 
    });
  }

  async findActiveNetworks(): Promise<NetworkSetting[]> {
    return this.networkSettingRepository.find({ 
      where: { is_active: true },
      order: { network_name: 'ASC' }
    });
  }

  async createNetworkSetting(
    networkName: string,
    rpcUrl: string,
    chainId?: number,
    blockExplorerUrl?: string,
    gasLimit: number = 21000,
    minGasPrice: number = 1,
    maxGasPrice: number = 1000000000,
  ): Promise<NetworkSetting> {
    const networkSetting = this.networkSettingRepository.create({
      network_name: networkName,
      rpc_url: rpcUrl,
      chain_id: chainId,
      block_explorer_url: blockExplorerUrl,
      gas_limit: gasLimit,
      min_gas_price: minGasPrice,
      max_gas_price: maxGasPrice,
      is_active: true,
    });
    return this.networkSettingRepository.save(networkSetting);
  }

  async updateRpcUrl(networkId: number, rpcUrl: string): Promise<NetworkSetting | null> {
    await this.networkSettingRepository.update(networkId, { rpc_url: rpcUrl });
    return this.findById(networkId);
  }

  async updateGasSettings(
    networkId: number,
    gasLimit?: number,
    minGasPrice?: number,
    maxGasPrice?: number,
  ): Promise<NetworkSetting | null> {
    const updateData: any = {};
    if (gasLimit !== undefined) updateData.gas_limit = gasLimit;
    if (minGasPrice !== undefined) updateData.min_gas_price = minGasPrice;
    if (maxGasPrice !== undefined) updateData.max_gas_price = maxGasPrice;
    
    await this.networkSettingRepository.update(networkId, updateData);
    return this.findById(networkId);
  }

  async activateNetwork(networkId: number): Promise<NetworkSetting | null> {
    await this.networkSettingRepository.update(networkId, { is_active: true });
    return this.findById(networkId);
  }

  async deactivateNetwork(networkId: number): Promise<NetworkSetting | null> {
    await this.networkSettingRepository.update(networkId, { is_active: false });
    return this.findById(networkId);
  }

  async updateBlockExplorerUrl(networkId: number, blockExplorerUrl: string): Promise<NetworkSetting | null> {
    await this.networkSettingRepository.update(networkId, { 
      block_explorer_url: blockExplorerUrl 
    });
    return this.findById(networkId);
  }

  async getNetworkByRpcUrl(rpcUrl: string): Promise<NetworkSetting | null> {
    return this.networkSettingRepository.findOne({ 
      where: { rpc_url: rpcUrl } 
    });
  }

  async getSupportedNetworks(): Promise<string[]> {
    const networks = await this.findActiveNetworks();
    return networks.map(network => network.network_name);
  }

  async validateGasPrice(networkId: number, gasPrice: number): Promise<boolean> {
    const network = await this.findById(networkId);
    if (!network) return false;
    
    return gasPrice >= network.min_gas_price && gasPrice <= network.max_gas_price;
  }

  async getRecommendedGasPrice(networkId: number): Promise<number> {
    const network = await this.findById(networkId);
    if (!network) return 0;
    
    // Retorna un precio de gas recomendado basado en los límites
    return Math.floor((network.min_gas_price + network.max_gas_price) / 2);
  }

  async getNetworkConfig(networkName: string): Promise<NetworkSetting | null> {
    return this.findByNetworkName(networkName);
  }
}
