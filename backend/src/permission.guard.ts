import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;
    const requestPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!requestPermissions) return true;

    const { permissions } = user;
    const permissionSet = permissions.reduce((pre, cur) => {
      pre.add(cur.code);
      return pre;
    }, new Set<string>());

    const hasPermission = requestPermissions.some((permission) =>
      permissionSet.has(permission),
    );
    if (!hasPermission) throw new ForbiddenException('没有权限');
    return true;
  }
}
