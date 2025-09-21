import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { TokensService } from '../../services/tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  async findAll() {
    return this.tokensService.findAll();
  }

  @Get('active')
  async findActiveTokens() {
    return this.tokensService.findActiveTokens();
  }

  @Get('popular')
  async getPopularTokens(@Query('limit') limit: number = 20) {
    return this.tokensService.getPopularTokens(limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.tokensService.findById(id);
  }

  @Get('symbol/:symbol')
  async findBySymbol(@Param('symbol') symbol: string) {
    return this.tokensService.findBySymbol(symbol);
  }

  @Get('network/:network')
  async findByNetwork(@Param('network') network: string) {
    return this.tokensService.findByNetwork(network);
  }

  @Get('network/:network/active')
  async findActiveTokensByNetwork(@Param('network') network: string) {
    return this.tokensService.findActiveTokensByNetwork(network);
  }

  @Get('symbol/:symbol/network/:network')
  async findBySymbolAndNetwork(
    @Param('symbol') symbol: string,
    @Param('network') network: string
  ) {
    return this.tokensService.findBySymbolAndNetwork(symbol, network);
  }

  @Get('contract/:contractAddress')
  async findByContractAddress(@Param('contractAddress') contractAddress: string) {
    return this.tokensService.findByContractAddress(contractAddress);
  }

  @Get(':id/balances')
  async getTokenWithBalances(@Param('id') id: number) {
    return this.tokensService.getTokenWithBalances(id);
  }

  @Post()
  async create(@Body() createTokenDto: any) {
    const { 
      symbol, 
      name, 
      network, 
      contractAddress, 
      decimals = 18, 
      logoUrl 
    } = createTokenDto;
    
    return this.tokensService.createToken(
      symbol, 
      name, 
      network, 
      contractAddress, 
      decimals, 
      logoUrl
    );
  }

  @Put(':id/activate')
  async activateToken(@Param('id') id: number) {
    return this.tokensService.activateToken(id);
  }

  @Put(':id/deactivate')
  async deactivateToken(@Param('id') id: number) {
    return this.tokensService.deactivateToken(id);
  }

  @Put(':id/logo')
  async updateLogoUrl(
    @Param('id') id: number,
    @Body() body: { logoUrl: string }
  ) {
    return this.tokensService.updateLogoUrl(id, body.logoUrl);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTokenDto: any) {
    return this.tokensService.update(id, updateTokenDto);
  }
}
