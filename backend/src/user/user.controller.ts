import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { isEmail } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, SetPermission } from 'src/common/decorator';

@Controller('user')
export class UserController {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Get('getVerifyCode')
  async getVefifyCode(
    @Query('email')
    email: string,
  ) {
    if (!isEmail(email, {})) {
      throw new BadRequestException('邮箱格式不正确');
    }
    const verifyCode = Math.floor(Math.random() * 1000000).toString();
    await this.userService.sendVerifyCode(email, verifyCode);
    return {
      code: 0,
    };
  }

  @Get('init')
  init() {
    return this.userService.initData();
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const userVo = await this.userService.login(loginUserDto);
    [userVo.access_token, userVo.refresh_token] =
      await this.userService.generateToken(userVo.user_info);
    return userVo;
  }

  @Get('refresh')
  async refresh(@Query('refresh_token') refresh_token: string) {
    try {
      const { username, userId } = await this.jwtService.verify<{
        userId: number;
        username: string;
      }>(refresh_token);
      const user = await this.userService.findOneUserBy({ id: userId }, [
        'roles',
        'roles.permissions',
      ]);
      const [access_token, new_refresh_token] =
        await this.userService.generateToken({
          username,
          id: userId,
          roles: user.roles,
          permissions: this.userService.generatePermissions(user.roles),
        });
      return {
        access_token,
        refresh_token: new_refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }

  @Get('aaa')
  @RequireLogin()
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
  @Get('ccc')
  @RequireLogin()
  @SetPermission('ccc')
  ccc() {
    return 'ccc';
  }
  @Get('ddd')
  @RequireLogin()
  @SetPermission('ddd')
  ddd() {
    return 'ddd';
  }
}
