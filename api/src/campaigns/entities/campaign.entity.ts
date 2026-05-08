import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Relation vers le Maître de Jeu
  @ManyToOne(() => User)
  @JoinColumn({ name: 'gm_id' })
  gm: User;

  // On utilise jsonb (optimisé pour PostgreSQL) pour stocker les options
  @Column({ type: 'jsonb', default: {} })
  options: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}