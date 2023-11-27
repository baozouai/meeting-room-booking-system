"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const redis_service_1 = require("../redis/redis.service");
const email_service_1 = require("../email/email.service");
let UserService = UserService_1 = class UserService {
    constructor() {
        this.logger = new common_1.Logger();
    }
    create(createUserDto) {
        return 'This action adds a new user';
    }
    findAll() {
        return `This action returns all user`;
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
    findOneUserBy(user) {
        return this.userRepository.findOneBy(user);
    }
    async register(registerUser) {
        if (registerUser.password !== registerUser.confirm_password)
            throw new common_1.BadRequestException('两次密码不一致');
        const redisVerifyCodeKey = `verify_code_${registerUser.email}`;
        const redisVerifyCode = await this.redisService.get(redisVerifyCodeKey);
        this.logger.log(redisVerifyCode, UserService_1);
        if (!redisVerifyCode)
            throw new common_1.BadRequestException('验证码已过期');
        if (redisVerifyCode !== registerUser.verification_code)
            throw new common_1.BadRequestException('验证码不正确');
        const existUser = await this.findOneUserBy({
            username: registerUser.username,
        });
        if (existUser)
            throw new common_1.BadRequestException('用户名已存在');
        const nicknameUser = await this.findOneUserBy({
            nickname: registerUser.nickname,
        });
        if (nicknameUser)
            throw new common_1.BadRequestException('昵称已被占用');
        const { username, password, nickname, email } = registerUser;
        const user = new user_entity_1.User({
            username,
            password,
            nickname,
            email,
        });
        try {
            await this.userRepository.insert(user);
            await this.redisService.del(redisVerifyCodeKey);
            return '注册成功';
        }
        catch (e) {
            this.logger.error(e, UserService_1);
            return '注册失败';
        }
    }
    async sendVerifyCode(email, verifyCode) {
        await this.redisService.set(`verify_code_${email}`, verifyCode, 60 * 5);
        await this.emailService.senEmail({
            to: email,
            subject: '会议室预定系统验证码',
            html: `<h1>验证码为： <u>${verifyCode}</u></h1>`,
        });
    }
};
exports.UserService = UserService;
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "userRepository", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
__decorate([
    (0, common_1.Inject)(email_service_1.EmailService),
    __metadata("design:type", email_service_1.EmailService)
], UserService.prototype, "emailService", void 0);
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map