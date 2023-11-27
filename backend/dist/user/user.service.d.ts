import { Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserService {
    logger: Logger;
    private readonly userRepository;
    private readonly redisService;
    private readonly emailService;
    create(createUserDto: CreateUserDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
    findOneUserBy(user: Partial<Omit<User, 'encryPassword'>>): Promise<User>;
    register(registerUser: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    sendVerifyCode(email: string, verifyCode: string): Promise<void>;
}
