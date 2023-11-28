import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class UserService {
  logger = new Logger();

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

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findOneUserBy(user: Partial<Omit<User, 'encryPassword'>>) {
    return this.userRepository.findOneBy(user);
  }

  async register(registerUser: RegisterUserDto) {
    if (registerUser.password !== registerUser.confirm_password)
      throw new BadRequestException('两次密码不一致');
    const redisVerifyCodeKey = `verify_code_${registerUser.email}`;
    const redisVerifyCode = await this.redisService.get(redisVerifyCodeKey);
    this.logger.log(redisVerifyCode, UserService);
    if (!redisVerifyCode) throw new BadRequestException('验证码已过期');
    if (redisVerifyCode !== registerUser.verification_code)
      throw new BadRequestException('验证码不正确');

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
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  async sendVerifyCode(email: string, verifyCode: string) {
    await this.redisService.set(`verify_code_${email}`, verifyCode, 60 * 5);
    await this.emailService.senEmail({
      to: email,
      subject: '会议室预定系统验证码',
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

    await this.permissionRepository.insert([permission1, permission2]);
    await this.roleRepository.insert([role1, role2]);
    await this.userRepository.insert([user1, user2]);
  }
}
