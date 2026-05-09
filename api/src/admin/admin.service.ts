import { Injectable } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../characters/entities/character.entity';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly usersService: UsersService,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      email: data.email,
      password_hash: hashedPassword,
      role: data.role || UserRole.PLAYER,
    });
    return this.userRepository.save(user);
  }

  async createCampaign(data: { name: string; gmId: string; options?: any }) {
    const { gmId, ...dto } = data;
    return this.campaignsService.create(dto, gmId);
  }

  async createCharacter(data: any) {
    const character = this.characterRepository.create(data);
    return this.characterRepository.save(character);
  }

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
