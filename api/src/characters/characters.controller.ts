import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('campaigns/:campaignId/characters')
@UseGuards(AuthGuard('jwt'))
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  // 1. Initialiser le personnage et récupérer les 10 jets
  @Post()
  async startCreation(@Param('campaignId') campaignId: string, @Request() req :any) {
    const character = await this.charactersService.createDraft(
      req.user.id,
      campaignId,
    );
    const rolls = this.charactersService.generateInitialRolls();
    return { character, rolls };
  }

  // 2. Le front-end envoie l'assignation choisie par le joueur
  @Patch(':id/stats')
  assignStats(
    @Param('id') id: string,
    @Body() body: { stats: Record<string, number> },
  ) {
    return this.charactersService.assignStats(id, body.stats);
  }

  // 3. Choix de la profession
  @Patch(':id/profession')
  setProfession(
    @Param('id') id: string,
    @Body()
    body: {
      profession: string;
      race: string;
      realm: string;
      replacePrimes: boolean;
    },
  ) {
    return this.charactersService.setProfession(
      id,
      body.profession,
      body.race,
      body.realm,
      body.replacePrimes,
    );
  }

  // 4. Lancement automatique par le backend des potentiels
  @Post(':id/potentials')
  generatePotentials(@Param('id') id: string) {
    return this.charactersService.generatePotentials(id);
  }
}
