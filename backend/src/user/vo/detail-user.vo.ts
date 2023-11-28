import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class DetailUserVo extends OmitType(User, [
  'encryPassword',
  'password',
  'create_time',
  'update_time',
  'roles',
]) {
  create_time: number;
}
