import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Si aucun rôle n'est fourni, on assigne PLAYER par défaut
    const role = registerDto.role || UserRole.PLAYER;
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      role,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Renvoie 200 OK au lieu de 201 Created
  async login(@Body() loginDto: LoginDto) {
    // On valide les identifiants
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    // On génère et renvoie le JWT
    return this.authService.login(user);
  }
}
