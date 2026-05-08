import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MON_SECRET_MVP_TRES_COMPLEXE', // Le même secret que dans auth.module.ts
    });
  }

  async validate(payload: any) {
    // Cette méthode attache cet objet à l'objet Request de Express (req.user)
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
