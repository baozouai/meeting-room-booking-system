import { User } from '../entities/user.entity';
declare const RegisterUserDto_base: import("@nestjs/mapped-types").MappedType<Pick<User, "username" | "password" | "email" | "phone_number">>;
export declare class RegisterUserDto extends RegisterUserDto_base {
    verification_code: string;
}
export {};
