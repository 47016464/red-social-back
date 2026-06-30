import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || user.perfil !== 'administrador') {
      throw new ForbiddenException('Solo los administradores pueden realizar esta acción');
    }
    return true;
  }
}