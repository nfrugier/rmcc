import { Injectable } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../characters/entities/character.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly usersService: UsersService,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async getGlobalStats() {
    const allUsers = await this.usersService.findAll();
    const allCampaigns = await this.campaignsService.findAll();

    return {
      totalUsers: allUsers.length,
      totalCampaigns: allCampaigns.length,
    };
  }

  async findAllUsers() {
    return this.usersService.findAll();
  }
  async updateUserRole(id: string, role: UserRole) {
    return this.usersService.updateRole(id, role);
  }
  async deleteUser(id: string) {
    return this.usersService.remove(id);
  }

  async findAllCampaigns() {
    return this.campaignsService.findAll();
  }
  async removeCampaign(id: string) {
    return this.campaignsService.remove(id);
  }
  async deleteCampaign(id: string) {
    return this.campaignsService.remove(id);
  }

  async findAllCharacters() {
    return this.characterRepository.find({ relations: ['player', 'campaign'] });
  }
  async deleteCharacter(id: string) {
    return this.characterRepository.delete(id);
  }
}
