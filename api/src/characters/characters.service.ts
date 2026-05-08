import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CreationStep } from './entities/character.entity';

@Injectable()
export class CharactersService {
  // Dictionnaire des caractéristiques principales (Prime Requisites) par profession [5]
  private readonly PRIME_REQUISITES = {
    Fighter: ['CO', 'ST'],
    Thief: ['QU', 'AG'],
    Rogue: ['ST', 'AG'],
    Magician: ['EM', 'RE'],
    Cleric: ['IN', 'ME'],
    Mentalist: ['SD', 'PR'],
    // À compléter avec les 19 professions de base
  };

  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  // ÉTAPE 1 : Générer les 10 jets de départ
  generateInitialRolls(): number[] {
    const rolls = [];
    while (rolls.length < 10) {
      const roll = Math.floor(Math.random() * 100) + 1;
      // Les règles stipulent d'ignorer tout jet inférieur à 20 [1]
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

  // ÉTAPE 2 : Assigner les stats aux caractéristiques
  async assignStats(
    characterId: string,
    assignedStats: Record<string, number>,
  ): Promise<Character> {
    // assignedStats = { ST: 85, QU: 92, ... } (10 au total)
    await this.charactersRepository.update(characterId, {
      stats_temp: assignedStats,
      step_status: CreationStep.STATS_ASSIGNED,
    });
    return this.charactersRepository.findOne({ where: { id: characterId } });
  }

  // ÉTAPE 3 : Choisir la profession et appliquer le boost à 90 [2]
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

    if (replacePrimes) {
      const primes = this.PRIME_REQUISITES[profession];
      if (primes) {
        primes.forEach((stat :any) => {
          // On remplace par 90 uniquement si le score actuel est inférieur [2]
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

  // ÉTAPE 4 : Générer les Potentiels
  async generatePotentials(characterId: string): Promise<Character> {
    const character = await this.charactersRepository.findOne({
      where: { id: characterId },
    });
    const potentials: Record<string, number> = {};

    for (const [statName, tempValue] of Object.entries(character.stats_temp)) {
      const roll = Math.floor(Math.random() * 100) + 1; // Jet 1-100 non ouvert [3]
      potentials[statName] = this.calculatePotential(tempValue, roll);
    }

    // Calcul des points de vie de base = Constitution temporaire / 10 (arrondi au supérieur) [6]
    const baseHits = Math.ceil(character.stats_temp['CO'] / 10);

    character.stats_pot = potentials;
    character.base_hits = baseHits;
    character.step_status = CreationStep.POTENTIALS_ROLLED;

    return this.charactersRepository.save(character);
  }

  // Le moteur de résolution de la Table 15.1.1 (Stat Potentials Table) [4]
  private calculatePotential(initialStat: number, roll: number): number {
    // Si la stat de base est déjà très haute (ex: 100), le potentiel est identique [4]
    if (initialStat >= 100) return initialStat;

    // MVP : Simulation simplifiée de la table 15.1.1 pour éviter de hardcoder les 100 lignes
    // Dans les règles, un jet de 1-10 garde la stat identique, et plus on se rapproche de 100,
    // plus on a de chance de combler l'écart vers 100.
    if (roll <= 10) return initialStat;

    // Calcul mathématique émulant la courbe de Rolemaster (la table officielle rapproche la stat
    // de 100 de façon logarithmique selon le jet).
    const gap = 100 - initialStat;
    const gainPercentage = (roll - 10) / 90; // Donne un % de progression dans le "gap"
    let potential = initialStat + Math.round(gap * gainPercentage);

    // Les potentiels maximums sont souvent plafonnés à des valeurs exactes de la table
    return potential > 100 ? 100 : potential;
  }
}
