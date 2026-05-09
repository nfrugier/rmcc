import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../characters/entities/character.entity';
import {User} from "../users/entities/user.entity";
import {Campaign} from "../campaigns/entities/campaign.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Character, User, Campaign]),
    CampaignsModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
