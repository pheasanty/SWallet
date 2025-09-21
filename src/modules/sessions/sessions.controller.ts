import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UserSessionsService } from '../../services/user-sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly userSessionsService: UserSessionsService) {}

  @Get()
  async findAll() {
    return this.userSessionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userSessionsService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number) {
    return this.userSessionsService.findByUserId(userId);
  }

  @Get('user/:userId/active')
  async findActiveSessions(@Param('userId') userId: number) {
    return this.userSessionsService.findActiveSessions(userId);
  }

  @Get('user/:userId/recent')
  async getRecentSessions(
    @Param('userId') userId: number,
    @Query('limit') limit: number = 10
  ) {
    return this.userSessionsService.getRecentSessions(userId, limit);
  }

  @Get('user/:userId/count')
  async getActiveSessionsCount(@Param('userId') userId: number) {
    return this.userSessionsService.getActiveSessionsCount(userId);
  }

  @Get('token/:sessionToken')
  async findBySessionToken(@Param('sessionToken') sessionToken: string) {
    return this.userSessionsService.findBySessionToken(sessionToken);
  }

  @Get('refresh/:refreshToken')
  async findByRefreshToken(@Param('refreshToken') refreshToken: string) {
    return this.userSessionsService.findByRefreshToken(refreshToken);
  }

  @Get('expired')
  async findExpiredSessions() {
    return this.userSessionsService.findExpiredSessions();
  }

  @Get(':id/with-user')
  async getSessionWithUser(@Param('id') id: number) {
    return this.userSessionsService.getSessionWithUser(id);
  }

  @Post()
  async createSession(@Body() body: {
    userId: number;
    sessionToken: string;
    expiresAt: string;
    refreshToken?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { userId, sessionToken, expiresAt, refreshToken, ipAddress, userAgent } = body;
    const expiresAtDate = new Date(expiresAt);
    
    return this.userSessionsService.createSession(
      userId,
      sessionToken,
      expiresAtDate,
      refreshToken,
      ipAddress,
      userAgent
    );
  }

  @Put(':id/deactivate')
  async deactivateSession(@Param('id') id: number) {
    return this.userSessionsService.deactivateSession(id);
  }

  @Put('user/:userId/deactivate-all')
  async deactivateAllUserSessions(@Param('userId') userId: number) {
    return this.userSessionsService.deactivateAllUserSessions(userId);
  }

  @Put(':id/refresh')
  async refreshSession(
    @Param('id') id: number,
    @Body() body: { sessionToken: string; expiresAt: string }
  ) {
    const { sessionToken, expiresAt } = body;
    const expiresAtDate = new Date(expiresAt);
    
    return this.userSessionsService.refreshSession(id, sessionToken, expiresAtDate);
  }

  @Put(':id/info')
  async updateSessionInfo(
    @Param('id') id: number,
    @Body() body: { ipAddress?: string; userAgent?: string }
  ) {
    const { ipAddress, userAgent } = body;
    return this.userSessionsService.updateSessionInfo(id, ipAddress, userAgent);
  }

  @Delete('cleanup')
  async cleanupExpiredSessions() {
    const deletedCount = await this.userSessionsService.cleanupExpiredSessions();
    return { message: `Cleaned up ${deletedCount} expired sessions` };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.userSessionsService.delete(id);
  }
}
