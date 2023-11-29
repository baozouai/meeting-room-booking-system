import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UserVo extends OmitType(User, [
  'encryPassword',
  'password',
  'create_time',
  'update_time',
  'roles',
]) {
  create_time: number;

  constructor(user?: User) {
    super();
    if (user) {
      this.id = user.id;
      this.username = user.username;
      this.email = user.email;
      this.avatar = user.avatar;
      this.nickname = user.nickname;
      this.phone_number = user.phone_number;
      this.is_admin = user.is_admin;
      this.is_frozen = user.is_frozen;
      this.create_time = user.create_time.getTime();
    }
  }
}
