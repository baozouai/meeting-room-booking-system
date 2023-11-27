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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./role.entity");
const class_validator_1 = require("class-validator");
const crypto_1 = require("crypto");
function md5(str) {
    const hash = (0, crypto_1.createHash)('md5');
    return hash.update(str).digest('hex');
}
let User = class User {
    constructor(partial) {
        Object.assign(this, partial);
    }
    encryPassword() {
        this.password = md5(this.password);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '用户名不能为空',
    }),
    (0, class_validator_1.Length)(6, 50, {
        message: '用户名长度必须为6-50位',
    }),
    (0, typeorm_1.Column)({
        length: 50,
        comment: '用户名',
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '用户名不能为空',
    }),
    (0, class_validator_1.Length)(6, 50, {
        message: '密码长度必须为6-50位',
    }),
    (0, typeorm_1.Column)({
        length: 50,
        comment: '密码',
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '邮箱不能为空',
    }),
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "encryPassword", null);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, typeorm_1.Column)({
        length: 50,
        comment: '邮箱',
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)('CN'),
    (0, typeorm_1.Column)({
        length: 20,
        comment: '手机号',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        comment: '头像',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '用户名不能为空',
    }),
    (0, class_validator_1.Length)(6, 50, {
        message: '昵称长度必须为6-50位',
    }),
    (0, typeorm_1.Column)({
        length: 50,
        comment: '昵称',
    }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '是否被冻结',
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_frozen", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '是否是管理员',
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_admin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        comment: '创建时间',
    }),
    __metadata("design:type", Date)
], User.prototype, "create_time", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        comment: '更新时间',
    }),
    __metadata("design:type", Date)
], User.prototype, "update_time", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role),
    (0, typeorm_1.JoinTable)({
        name: 'user_roles',
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], User);
//# sourceMappingURL=user.entity.js.map