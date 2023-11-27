import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): string;
    findAll(): string;
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
    register(registerUser: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    getVefifyCode(email: string): Promise<{
        code: number;
    }>;
}
