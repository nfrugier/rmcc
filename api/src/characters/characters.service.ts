import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CreationStep } from './entities/character.entity';

@Injectable()
export class CharactersService {
  // Correction TS7053 : Ajout d'une signature d'index [key: string] pour permettre l'accès dynamique
  private readonly PRIME_REQUISITES: Record<string, string[]> = {
    Fighter: ['CO', 'ST'],
    Thief: ['QU', 'AG'],
    Rogue: ['ST', 'AG'],
    Magician: ['EM', 'RE'],
    Cleric: ['IN', 'ME'],
    Mentalist: ['SD', 'PR'],
  };

  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  generateInitialRolls(): number[] {
    const rolls = [];
    while (rolls.length < 10) {
      const roll = Math.floor(Math.random() * 100) + 1;
      // Les règles suggèrent souvent de relancer les très bas scores.
      if (roll >= 20) {
        rolls.push(roll);
      }
    }
    return rolls;
  }

  async createDraft(playerId: string, campaignId: string): Promise<Character> {
    const character = this.charactersRepository.create({
      player: { id: playerId },
      campaign: { id: campaignId },
      step_status: CreationStep.STATS_ROLLED,
    });
    return this.charactersRepository.save(character);
  }

  async assignStats(
    characterId: string,
    assignedStats: Record<string, number>,
  ): Promise<Character> {
    await this.charactersRepository.update(characterId, {
      stats_temp: assignedStats,
      step_status: CreationStep.STATS_ASSIGNED,
    });

    // Correction TS2322 : Utilisation d'une exception si le personnage n'est pas trouvé
    const updatedCharacter = await this.charactersRepository.findOne({
      where: { id: characterId },
    });
    if (!updatedCharacter) throw new NotFoundException('Character not found');
    return updatedCharacter;
  }

  async setProfession(
    characterId: string,
    profession: string,
    race: string,
    realm: string,
    replacePrimes: boolean,
  ): Promise<Character> {
    const character = await this.charactersRepository.findOne({
      where: { id: characterId },
    });

    // Correction TS18047 : Vérification systématique de l'existence de l'entité
    if (!character) throw new NotFoundException('Character not found');

    if (replacePrimes) {
      const primes = this.PRIME_REQUISITES[profession];
      if (primes && character.stats_temp) {
        primes.forEach((stat) => {
          // Les statistiques principales (Primes) peuvent être montées à 90.
          if (character.stats_temp[stat] < 90) {
            character.stats_temp[stat] = 90;
          }
        });
      }
    }

    character.profession = profession;
    character.race = race;
    character.realm = realm;
    character.step_status = CreationStep.PROFESSION_CHOSEN;

    return this.charactersRepository.save(character);
  }

  async generatePotentials(characterId: string): Promise<Character> {
    const character = await this.charactersRepository.findOne({
      where: { id: characterId },
    });

    if (!character || !character.stats_temp) {
      throw new NotFoundException('Character or stats not found');
    }

    const potentials: Record<string, number> = {};

    for (const [statName, tempValue] of Object.entries(character.stats_temp)) {
      const roll = Math.floor(Math.random() * 100) + 1;
      potentials[statName] = this.calculatePotential(tempValue, roll);
    }

    // Les points de vie de base dépendent souvent de la Constitution.
    const baseHits = Math.ceil(character.stats_temp['CO'] / 10);

    character.stats_pot = potentials;
    character.base_hits = baseHits;
    character.step_status = CreationStep.POTENTIALS_ROLLED;

    return this.charactersRepository.save(character);
  }

  private calculatePotential(initialStat: number, roll: number): number {
    if (initialStat >= 100) return initialStat;
    if (roll <= 10) return initialStat;

    const gap = 100 - initialStat;
    const gainPercentage = (roll - 10) / 90;
    const potential = initialStat + Math.round(gap * gainPercentage);

    return potential > 100 ? 100 : potential;
  }
}
