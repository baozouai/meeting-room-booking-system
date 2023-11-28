import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JWTUserData } from './user/vo/login-user.vo';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
declare module 'express' {
  interface Request {
    user: JWTUserData;
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  reflector: Reflector;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireLogin) return true;

    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException('请先登录');
    try {
      const token = authorization.split(' ')[1];
      request.user = this.jwtService.verify<JWTUserData>(token);
      return true;
    } catch (e) {
      throw new UnauthorizedException('token失效，请重新登录');
    }
  }
}
