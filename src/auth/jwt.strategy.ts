// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JWT_SECRET_ORBIT_2024',
    });
  }

  async validate(payload: { sub: string; username: string }) {
    const usuario = await this.usuariosService.buscarPorId(payload.sub);
    if (!usuario) throw new UnauthorizedException();
    return usuario; // queda disponible como req.user
  }
}

// ─────────────────────────────────────────────
// jwt-auth.guard.ts  (podés crear un archivo separado o dejarlo acá)
// ─────────────────────────────────────────────
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}