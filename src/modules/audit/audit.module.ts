import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsService } from '../../services/audit-logs.service';
import { AuditController } from './audit.controller';
import { AuditLog } from '../../entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditModule {}
