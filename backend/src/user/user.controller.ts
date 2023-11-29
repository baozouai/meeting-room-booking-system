import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
  Inject,
  UnauthorizedException,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { isEmail } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, SetPermission, UserInfo } from 'src/common/decorator';
import { DetailUserVo } from './vo/detail-user.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('用户')
@Controller('user')
export class UserController {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @ApiQuery({
    type: 'string',
    name: 'email',
    description: '邮箱',
    example: 'abcd@gmai.com',
  })
  @ApiOkResponse({
    description: '发送成功',
    type: String,
  })
  @ApiBadRequestResponse({
    description: '邮箱格式不正确',
    type: String,
  })
  @Get('register/verify_code')
  async getVefifyCode(
    /** 邮箱 */
    @Query('email') /** 邮箱 */ email: string,
  ) {
    if (!isEmail(email, {})) {
      throw new BadRequestException('邮箱格式不正确');
    }
    await this.userService.sendVerifyCode(
      `verify_code_${email}`,
      email,
      '会议室预定系统',
    );
    return '发送成功';
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

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findOneUserBy({
      id: userId,
    });
    const detailUserVo = new DetailUserVo();
    detailUserVo.id = user.id;
    detailUserVo.username = user.username;
    detailUserVo.avatar = user.avatar;
    detailUserVo.email = user.email;
    detailUserVo.is_admin = user.is_admin;
    detailUserVo.is_frozen = user.is_frozen;
    detailUserVo.phone_number = user.phone_number;
    detailUserVo.nickname = user.nickname;
    detailUserVo.create_time = user.create_time.getTime();

    return detailUserVo;
  }

  @Get('update_password/verify_code')
  @RequireLogin()
  async updatePasswordByVerifyCode(@UserInfo('userId') userId: number) {
    await this.userService.generateUpdatePasswordVerifyCode(userId);
  }

  @Post('update_password')
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updatePassword(userId, passwordDto);
  }

  @Post('update')
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(userId, updateUserDto);
    return this.info(userId);
  }

  @Get('update/verify_code')
  @RequireLogin()
  async getUpdateVerifyCode(@UserInfo('userId') userId: number) {
    const user = await this.userService.findOneUserBy({
      id: userId,
    });
    if (!user) throw new BadRequestException('用户不存在');
    await this.userService.sendVerifyCode(
      `update_user_info_${userId}`,
      user.email,
      `会议室用户信息修改`,
    );
  }

  @Post('freeze')
  @RequireLogin()
  async freeze(@Body('user_id') userId: number) {
    await this.userService.freeUserById(userId);
    return '已冻结';
  }

  @Get('list')
  @RequireLogin()
  async list(
    @Query('offset', new DefaultValuePipe(0), generateParseIntPipe('offset'))
    offset: number,
    @Query('limit', new DefaultValuePipe(2), generateParseIntPipe('offset'))
    limit: number,
    @Query('username') username: string,
    @Query('nickname') nickname: string,
    @Query('enmail') enmail: string,
  ) {
    return this.userService.findUsers(
      offset,
      limit,
      username,
      nickname,
      enmail,
    );
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
