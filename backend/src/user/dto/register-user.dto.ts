import { PickType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsPassportNumber,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class RegisterUserDto extends PickType(User, [
  'username',
  'password',
  'email',
  'nickname',
]) {
  /** 验证码 */
  @IsString({
    each: false,
  })
  @IsNotEmpty({
    each: false,
    message: '验证码不能为空',
  })
  @Length(6, 6, {
    each: false,
    message: '验证码长度必须为6位',
  })
  verification_code: string;
  /** 确认密码 */
  @IsString({
    each: false,
  })
  @IsNotEmpty({
    each: false,
    message: '确认密码不能为空',
  })
  confirm_password: string;
}
