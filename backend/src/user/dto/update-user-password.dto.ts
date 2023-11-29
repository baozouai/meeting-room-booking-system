import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { StringNotEmptyWithLen } from 'src/common/decorator';

export class UpdateUserPasswordDto extends PickType(User, [
  'password',
  'username',
]) {
  @StringNotEmptyWithLen('旧密码', 6, 50)
  // old_password: string;
  /** 验证码 */
  @StringNotEmptyWithLen('验证码', 6, 6)
  verification_code: string;
}
