import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/campaign.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('campaigns')
@UseGuards(AuthGuard('jwt')) // Bloque l'accès si pas de token valide
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto, @Request() req :any) {
    // req.user contient l'ID grâce au token JWT décodé
    return this.campaignsService.create(createCampaignDto, req.user.id);
  }

  @Get()
  findAllByGm(@Request() req :any) {
    return this.campaignsService.findAllByGm(req.user.id);
  }
}
