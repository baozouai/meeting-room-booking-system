import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, md5 } from './entities/user.entity';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVO } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserVo } from './vo/user.vo';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;
  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { verification_code, ...rest } = updateUserDto;
    const redisUpdateCacheKey = `update_user_info_${id}`;
    await this.checkVerifyCode(redisUpdateCacheKey, verification_code);
    const user = await this.findOneUserBy({ id });
    if (!user) throw new BadRequestException('用户不存在');
    for (const key in rest) {
      const value = updateUserDto[key];
      if (value !== undefined) user[key] = value;
    }
    try {
      await this.userRepository.save(user);
      await this.redisService.del(redisUpdateCacheKey);
    } catch (e) {
      this.logger.error(e.message, e);
      throw new InternalServerErrorException(e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findOneUserBy(
    user: Partial<Omit<User, 'encryPassword'>>,
    relations?: FindOneOptions<User>['relations'],
  ) {
    return this.userRepository.findOne({
      where: {
        ...user,
      },
      relations,
    });
  }

  async register(registerUser: RegisterUserDto) {
    if (registerUser.password !== registerUser.confirm_password)
      throw new BadRequestException('两次密码不一致');
    const redisVerifyCodeKey = `verify_code_${registerUser.email}`;
    await this.checkVerifyCode(
      redisVerifyCodeKey,
      registerUser.verification_code,
    );

    const existUser = await this.findOneUserBy({
      username: registerUser.username,
    });
    if (existUser) throw new BadRequestException('用户名已存在');
    const nicknameUser = await this.findOneUserBy({
      nickname: registerUser.nickname,
    });
    if (nicknameUser) throw new BadRequestException('昵称已被占用');
    const { username, password, nickname, email } = registerUser;
    const user = new User({
      username,
      password,
      nickname,
      email,
    });

    try {
      await this.userRepository.insert(user);
      await this.redisService.del(redisVerifyCodeKey);
      return '注册成功';
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async sendVerifyCode(key: string, email: string, subject: string) {
    const verifyCode = Math.random().toString().slice(2, 8);
    await this.redisService.set(key, verifyCode, 60 * 5);
    await this.emailService.senEmail({
      to: email,
      subject: subject + '验证码',
      html: `<h1>验证码为： <u>${verifyCode}</u></h1>`,
    });
  }

  async initData() {
    const permission1 = new Permission({
      code: 'ccc',
      description: '访问 ccc 接口',
    });

    const permission2 = new Permission({
      code: 'ddd',
      description: '访问 ddd 接口',
    });
    const role1 = new Role({
      name: '管理员',
      permissions: [permission1, permission2],
    });

    const role2 = new Role({
      name: '普通用户',
      permissions: [permission1],
    });
    const user1 = new User({
      username: 'zhangsan',
      password: '111111',
      email: 'xxx@xx.com',
      is_admin: true,
      nickname: '张三',
      phone_number: '13233323333',
      roles: [role1],
    });

    const user2 = new User({
      username: 'lisi',
      password: '222222',
      email: 'yy@yy.com',
      nickname: '李四',
      roles: [role2],
    });

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.findOneUserBy(
      {
        username: loginUserDto.username,
      },
      ['roles', 'roles.permissions'],
    );
    this.logger.log(user);
    if (!user || user.password !== md5(loginUserDto.password)) {
      throw new BadRequestException('用户名或密码错误');
    }
    delete user.password;
    const loginUserVo = new LoginUserVO();

    loginUserVo.user_info = {
      ...user,
      create_time: user.create_time.getTime(),
      permissions: this.generatePermissions(user.roles),
    };
    return loginUserVo;
  }

  async generateToken(
    userInfo: Pick<
      LoginUserVO['user_info'],
      'username' | 'id' | 'roles' | 'permissions'
    >,
  ) {
    const { username, id, roles, permissions } = userInfo;
    const access_token = this.jwtService.sign(
      {
        username,
        userId: id,
        roles,
        permissions,
      },
      {
        expiresIn:
          this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME') || '30m',
      },
    );
    const refresh_token = await this.jwtService.sign(
      {
        username,
        userId: id,
      },
      {
        expiresIn:
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME') || '7d',
      },
    );
    return [access_token, refresh_token];
  }

  generatePermissions(roles: Role[]) {
    const permissionMap = roles.reduce((pre, cur) => {
      cur.permissions.forEach((permission) => {
        pre.set(permission.code, permission);
      });
      return pre;
    }, new Map<string, Permission>());
    return [...permissionMap.values()];
  }

  async generateUpdatePasswordVerifyCode(username: string) {
    const user = await this.findOneUserBy({ username });

    if (!user) throw new BadRequestException('用户不存在');

    try {
      await this.sendVerifyCode(
        `update_password_${username}`,
        user.email,
        '会议室修改密码',
      );
      return '发送成功';
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updatePassword(updateUserPasswordDto: UpdateUserPasswordDto) {
    const username = updateUserPasswordDto.username;
    const redisUpdatePasswordKey = `update_password_${username}`;
    await this.checkVerifyCode(
      redisUpdatePasswordKey,
      updateUserPasswordDto.verification_code,
    );

    const user = await this.findOneUserBy({
      username,
    });

    if (!user) throw new BadRequestException('用户不存在');
    // if (user.password !== md5(updateUserPasswordDto.old_password))
    //   throw new BadRequestException('旧密码不正确');
    if (user.password === md5(updateUserPasswordDto.password))
      throw new BadRequestException('新密码不能与旧密码相同');

    user.password = md5(updateUserPasswordDto.password);

    try {
      await this.userRepository.save(user);
      await this.redisService.del(redisUpdatePasswordKey);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }
  }

  async checkVerifyCode(key: string, verifyCode: string) {
    const cacheVerifyCode = await this.redisService.get(key);

    if (!cacheVerifyCode) throw new BadRequestException('验证码已过期');
    if (cacheVerifyCode !== verifyCode)
      throw new BadRequestException('验证码不正确');
    return true;
  }

  freeUserById(userId: number) {
    return this.userRepository.update(userId, {
      is_frozen: true,
    });
  }

  async findUsers(
    offset: number,
    limit: number,
    username?: string,
    nickname?: string,
    email?: string,
  ) {
    const condition: FindOneOptions<User>['where'] = {};
    if (username) condition.username = Like(`%${username}%`);
    if (nickname) condition.nickname = Like(`%${nickname}%`);
    if (email) condition.email = Like(`%${email}%`);
    const [users, totalCount] = await this.userRepository.findAndCount({
      where: condition,
      skip: offset,
      take: limit,
    });
    return {
      users: users.map((user) => new UserVo(user)),
      totalCount,
    };
  }
}
