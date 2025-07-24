import { Roles } from '@decorators/role.decorator';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles || !roles.length || !request.user) {
      return true;
    }
    const isMatch = roles.some(role => role === request.user.role);
    if (!isMatch) {
      throw new ForbiddenException(this.i18n.t('app.http.forbidden'));
    }
    return true;
  }
}
