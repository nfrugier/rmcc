import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // L'objet user a été injecté juste avant par la JwtStrategy

    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Accès refusé : espace réservé aux administrateurs.',
      );
    }
    return true; // L'accès est autorisé
  }
}
