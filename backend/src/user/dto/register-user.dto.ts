import { PickType } from '@nestjs/mapped-types';
import { Length } from 'class-validator';
import { User } from '../entities/user.entity';
import { StringNotEmpty } from 'src/common/decorator';

export class RegisterUserDto extends PickType(User, [
  'username',
  'password',
  'email',
  'nickname',
]) {
  /** 验证码 */
  @StringNotEmpty('验证码')
  @Length(6, 6, {
    each: false,
    message: '验证码长度必须为6位',
  })
  verification_code: string;
  /** 确认密码 */
  @StringNotEmpty('确认密码')
  confirm_password: string;
}
