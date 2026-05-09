import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignsRepository: Repository<Campaign>,
  ) {}

  async create(
    createCampaignDto: CreateCampaignDto,
    gmId: string,
  ): Promise<Campaign> {
    // Par défaut en T1, on met les règles de base si le MJ ne précise rien
    const defaultOptions = {
      useLinearStats: false,
      useLevelLess: false,
      ...createCampaignDto.options,
    };

    const campaign = this.campaignsRepository.create({
      name: createCampaignDto.name,
      options: defaultOptions,
      gm: { id: gmId }, // On lie l'ID du MJ récupéré via le token JWT
    });

    return this.campaignsRepository.save(campaign);
  }

  async findAllByGm(gmId: string): Promise<Campaign[]> {
    return this.campaignsRepository.find({
      where: { gm: { id: gmId } },
      order: { created_at: 'DESC' },
    });
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignsRepository.find({ relations: ['gm'] });
  }

  async remove(id: string): Promise<void> {
    const result = await this.campaignsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
  }

  async findAllGlobal(): Promise<Campaign[]> {
    // On charge la relation 'gm' pour afficher l'email du MJ dans le tableau admin
    return this.campaignsRepository.find({ relations: ['gm'] });
  }
}
