import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: Partial<User>) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    const total = await this.usersService.count();
    const activeUsers = await this.usersService.findActiveUsers();
    
    return {
      data: users,
      meta: {
        total,
        active: activeUsers.length,
        inactive: total - activeUsers.length,
      },
    };
  }

  @Get('stats')
  async getStats() {
    const total = await this.usersService.count();
    const activeUsers = await this.usersService.findActiveUsers();
    const active = activeUsers.length;
    
    return {
      totalUsers: total,
      activeUsers: active,
      inactiveUsers: total - active,
      percentageActive: total > 0 ? ((active / total) * 100).toFixed(2) : 0,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(parseInt(id));
    if (!user) {
      return {
        error: 'Usuario no encontrado',
        statusCode: 404,
      };
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    const user = await this.usersService.update(parseInt(id), updateUserDto);
    if (!user) {
      return {
        error: 'Usuario no encontrado',
        statusCode: 404,
      };
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.delete(parseInt(id));
  }
}
