import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { StringNotEmpty } from 'src/common/decorator';
import { Length } from 'class-validator';

export class UpdateUserDto extends PickType(PartialType(User), [
  // 'avatar',
  'email',
  'nickname',
]) {
  // avatar: File;
  /** 验证码 */
  @StringNotEmpty('验证码')
  @Length(6, 6, {
    each: false,
    message: '验证码长度必须为6位',
  })
  verification_code: string;
}
