import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Vérifie les identifiants
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  // Crée un compte
  async register(email: string, pass: string, role: UserRole) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const user = await this.usersService.create(email, hashedPassword, role);
    return this.login(user); // Auto-login après inscription
  }

  // Génère le token de session
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
