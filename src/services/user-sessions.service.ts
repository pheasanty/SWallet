import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../entities/user-session.entity';
import { BaseService } from './base.service';

@Injectable()
export class UserSessionsService extends BaseService<UserSession> {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {
    super(userSessionRepository);
  }

  async findByUserId(userId: number): Promise<UserSession[]> {
    return this.userSessionRepository.find({ 
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });
  }

  async findBySessionToken(sessionToken: string): Promise<UserSession | null> {
    return this.userSessionRepository.findOne({ 
      where: { session_token: sessionToken }
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    return this.userSessionRepository.findOne({ 
      where: { refresh_token: refreshToken }
    });
  }

  async findActiveSessions(userId: number): Promise<UserSession[]> {
    return this.userSessionRepository.find({ 
      where: { user_id: userId, is_active: true },
      order: { created_at: 'DESC' }
    });
  }

  async findExpiredSessions(): Promise<UserSession[]> {
    return this.userSessionRepository
      .createQueryBuilder('session')
      .where('session.expires_at < :now', { now: new Date() })
      .getMany();
  }

  async getSessionWithUser(sessionId: number): Promise<UserSession | null> {
    return this.userSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });
  }

  async createSession(
    userId: number,
    sessionToken: string,
    expiresAt: Date,
    refreshToken?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSession> {
    const session = this.userSessionRepository.create({
      user_id: userId,
      session_token: sessionToken,
      refresh_token: refreshToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: expiresAt,
      is_active: true,
    });
    return this.userSessionRepository.save(session);
  }

  async deactivateSession(sessionId: number): Promise<UserSession | null> {
    await this.userSessionRepository.update(sessionId, { is_active: false });
    return this.findById(sessionId);
  }

  async deactivateAllUserSessions(userId: number): Promise<void> {
    await this.userSessionRepository.update(
      { user_id: userId },
      { is_active: false }
    );
  }

  async refreshSession(sessionId: number, newSessionToken: string, newExpiresAt: Date): Promise<UserSession | null> {
    await this.userSessionRepository.update(sessionId, { 
      session_token: newSessionToken,
      expires_at: newExpiresAt
    });
    return this.findById(sessionId);
  }

  async updateSessionInfo(sessionId: number, ipAddress?: string, userAgent?: string): Promise<UserSession | null> {
    const updateData: any = {};
    if (ipAddress) updateData.ip_address = ipAddress;
    if (userAgent) updateData.user_agent = userAgent;
    
    await this.userSessionRepository.update(sessionId, updateData);
    return this.findById(sessionId);
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.userSessionRepository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
    
    return result.affected || 0;
  }

  async getActiveSessionsCount(userId: number): Promise<number> {
    return this.userSessionRepository.count({
      where: { user_id: userId, is_active: true }
    });
  }

  async getRecentSessions(userId: number, limit: number = 10): Promise<UserSession[]> {
    return this.userSessionRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
