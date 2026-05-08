import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(
    email: string,
    password_hash: string,
    role: UserRole,
  ): Promise<User> {
    const user = this.usersRepository.create({
      email,
      password_hash,
      role,
    });
    return this.usersRepository.save(user);
  }
}
