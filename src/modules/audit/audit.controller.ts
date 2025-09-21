import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { AuditLogsService } from '../../services/audit-logs.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('recent')
  async getRecentLogs(@Query('limit') limit: number = 100) {
    return this.auditLogsService.getRecentLogs(limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.auditLogsService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number) {
    return this.auditLogsService.findByUserId(userId);
  }

  @Get('user/:userId/recent')
  async getLogsByUser(
    @Param('userId') userId: number,
    @Query('limit') limit: number = 50
  ) {
    return this.auditLogsService.getLogsByUser(userId, limit);
  }

  @Get('action/:action')
  async findByAction(@Param('action') action: string) {
    return this.auditLogsService.findByAction(action);
  }

  @Get('user/:userId/action/:action')
  async findByUserAndAction(
    @Param('userId') userId: number,
    @Param('action') action: string
  ) {
    return this.auditLogsService.findByUserAndAction(userId, action);
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.auditLogsService.findByDateRange(start, end);
  }

  @Get(':id/with-user')
  async getAuditLogWithUser(@Param('id') id: number) {
    return this.auditLogsService.getAuditLogWithUser(id);
  }

  @Post('log')
  async createAuditLog(@Body() body: { 
    userId?: number; 
    action: string; 
    metadata?: Record<string, any> 
  }) {
    const { userId, action, metadata } = body;
    return this.auditLogsService.createAuditLog(userId, action, metadata);
  }

  @Post('user-action')
  async logUserAction(@Body() body: { 
    userId: number; 
    action: string; 
    metadata?: Record<string, any> 
  }) {
    const { userId, action, metadata } = body;
    return this.auditLogsService.logUserAction(userId, action, metadata);
  }

  @Post('system-action')
  async logSystemAction(@Body() body: { 
    action: string; 
    metadata?: Record<string, any> 
  }) {
    const { action, metadata } = body;
    return this.auditLogsService.logSystemAction(action, metadata);
  }
}
