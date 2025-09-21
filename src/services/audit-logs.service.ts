import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { BaseService } from './base.service';

@Injectable()
export class AuditLogsService extends BaseService<AuditLog> {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {
    super(auditLogRepository);
  }

  async findByUserId(userId: number): Promise<AuditLog[]> {
    return this.auditLogRepository.find({ 
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({ 
      where: { action },
      order: { created_at: 'DESC' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('audit_log')
      .where('audit_log.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('audit_log.created_at', 'DESC')
      .getMany();
  }

  async findByUserAndAction(userId: number, action: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { user_id: userId, action },
      order: { created_at: 'DESC' }
    });
  }

  async getAuditLogWithUser(auditLogId: number): Promise<AuditLog | null> {
    return this.auditLogRepository.findOne({
      where: { id: auditLogId },
      relations: ['user'],
    });
  }

  async createAuditLog(
    userId: number | null,
    action: string,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      user_id: userId,
      action,
      metadata,
    });
    return this.auditLogRepository.save(auditLog);
  }

  async logUserAction(userId: number, action: string, metadata?: Record<string, any>): Promise<AuditLog> {
    return this.createAuditLog(userId, action, metadata);
  }

  async logSystemAction(action: string, metadata?: Record<string, any>): Promise<AuditLog> {
    return this.createAuditLog(null, action, metadata);
  }

  async getRecentLogs(limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getLogsByUser(userId: number, limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
