import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';

export enum CreationStep {
  STATS_ROLLED = 'STATS_ROLLED',
  STATS_ASSIGNED = 'STATS_ASSIGNED',
  PROFESSION_CHOSEN = 'PROFESSION_CHOSEN',
  POTENTIALS_ROLLED = 'POTENTIALS_ROLLED',
  READY = 'READY',
}

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player_id' })
  player: User;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  race: string;

  @Column({ nullable: true })
  realm: string;

  // JSONB est parfait pour stocker { "ST": 90, "QU": 85, "EM": 42 ... }
  @Column({ type: 'jsonb', nullable: true })
  stats_temp: Record<string, number>;

  @Column({ type: 'jsonb', nullable: true })
  stats_pot: Record<string, number>;

  @Column({ type: 'int', default: 0 })
  base_hits: number;

  @Column({ type: 'boolean', default: false })
  is_npc: boolean;

  @Column({
    type: 'enum',
    enum: CreationStep,
    default: CreationStep.STATS_ROLLED,
  })
  step_status: CreationStep;

  @CreateDateColumn()
  created_at: Date;
}

