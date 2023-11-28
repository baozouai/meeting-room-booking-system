import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class LoginUserDto extends PickType(User, [
  'username',
  'password',
  'is_admin',
]) {}
