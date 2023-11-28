import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';

interface UserInfo
  extends Omit<
    User,
    'encryPassword' | 'password' | 'create_time' | 'update_time'
  > {
  roles: Role[];
  permissions: Permission[];
  create_time: number;
}
export class LoginUserVO {
  user_info: UserInfo;
  access_token: string;
  refresh_token: string;
}

export interface JWTUserData
  extends Pick<UserInfo, 'username' | 'roles' | 'permissions'> {
  userId: number;
}
