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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = require("nodemailer");
const config_1 = require("@nestjs/config");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transport = (0, nodemailer_1.createTransport)({
            host: 'smtp.qq.com',
            port: 587,
            secure: false,
            auth: {
                user: configService.get('EMAIL_AUTH_USER'),
                pass: configService.get('EMAIL_AUTH_PASS'),
            },
        });
    }
    senEmail(info) {
        return this.transport.sendMail({
            ...info,
            from: {
                name: '会议室预定系统',
                address: this.configService.get('EMAIL_FROM_ADDRESS'),
            },
        });
    }
    create(createEmailDto) {
        return 'This action adds a new email';
    }
    findAll() {
        return `This action returns all email`;
    }
    findOne(id) {
        return `This action returns a #${id} email`;
    }
    update(id, updateEmailDto) {
        return `This action updates a #${id} email`;
    }
    remove(id) {
        return `This action removes a #${id} email`;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_1.ConfigService)),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map