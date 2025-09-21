import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkSettingsService } from '../../services/network-settings.service';
import { NetworksController } from './networks.controller';
import { NetworkSetting } from '../../entities/network-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NetworkSetting])],
  controllers: [NetworksController],
  providers: [NetworkSettingsService],
  exports: [NetworkSettingsService],
})
export class NetworksModule {}
