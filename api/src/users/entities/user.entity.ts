import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  GM = 'GM',
  PLAYER = 'PLAYER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @Column({ nullable: true })
  reset_token: string;

  @CreateDateColumn()
  created_at: Date;
}
