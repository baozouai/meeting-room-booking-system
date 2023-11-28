import {
  BadRequestException,
  ExecutionContext,
  SetMetadata,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Request } from 'express';
import { JWTUserData } from 'src/user/vo/login-user.vo';

export const StringNotEmpty = (name: string) => {
  return applyDecorators(
    IsString({
      message: `${name}是字符串`,
    }),
    IsNotEmpty({
      message: `${name}不能为空`,
    }),
  );
};
export const StringNotEmptyWithLen = (
  name: string,
  min?: number,
  max?: number,
) => {
  return applyDecorators(
    StringNotEmpty(name),
    Length(min, max, {
      message:
        min === max ? `${name} 必须为${min}位` : `${name}为 ${min} ~ ${max} 位`,
    }),
  );
};

export const QueryParamNotEmpty = createParamDecorator(
  (param: any, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const value = request.query[param];
    if (value === undefined) {
      throw new BadRequestException(`${param}不允许为空`);
    }
    return value;
  },
);

export const RequireLogin = () => SetMetadata('require-login', true);
export const SetPermission = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

export const UserInfo = createParamDecorator(
  (key: keyof JWTUserData, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const { user } = request;
    if (!user) return null;
    return key ? user[key] : user;
  },
);
