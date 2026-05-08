import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: "Le format de l'email est invalide." })
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Le mot de passe doit faire au moins 6 caractères.',
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
