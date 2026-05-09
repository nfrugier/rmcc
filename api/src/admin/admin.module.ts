import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../characters/entities/character.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
    CampaignsModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
