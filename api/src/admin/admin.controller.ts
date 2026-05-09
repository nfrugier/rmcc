import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getGlobalStats();
  }

  // USERS
  @Get('users')
  getUsers() {
    return this.adminService.findAllUsers();
  }

  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // CAMPAIGNS
  @Get('campaigns')
  getCampaigns() {
    return this.adminService.findAllCampaigns();
  }

  @Delete('campaigns/:id')
  deleteCampaign(@Param('id') id: string) {
    return this.adminService.deleteCampaign(id);
  }

  // CHARACTERS
  @Get('characters')
  getCharacters() {
    return this.adminService.findAllCharacters();
  }

  @Delete('characters/:id')
  deleteCharacter(@Param('id') id: string) {
    return this.adminService.deleteCharacter(id);
  }
}
