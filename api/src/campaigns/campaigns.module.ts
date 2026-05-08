import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  controllers: [CampaignsController],
  providers: [CampaignsService]
})
export class CampaignsModule {}
