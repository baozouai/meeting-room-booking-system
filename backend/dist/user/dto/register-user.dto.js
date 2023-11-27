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
exports.RegisterUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../entities/user.entity");
class RegisterUserDto extends (0, mapped_types_1.PickType)(user_entity_1.User, [
    'username',
    'password',
    'email',
    'nickname',
]) {
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsString)({
        each: false,
    }),
    (0, class_validator_1.IsNotEmpty)({
        each: false,
        message: '验证码不能为空',
    }),
    (0, class_validator_1.Length)(6, 6, {
        each: false,
        message: '验证码长度必须为6位',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "verification_code", void 0);
__decorate([
    (0, class_validator_1.IsString)({
        each: false,
    }),
    (0, class_validator_1.IsNotEmpty)({
        each: false,
        message: '确认密码不能为空',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "confirm_password", void 0);
//# sourceMappingURL=register-user.dto.js.map