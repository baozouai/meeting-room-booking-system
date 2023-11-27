import { Role } from './role.entity';
export declare class User {
    constructor(partial: Partial<User>);
    id: number;
    username: string;
    password: string;
    encryPassword(): void;
    email: string;
    phone_number: string;
    avatar: string;
    nickname: string;
    is_frozen: boolean;
    is_admin: boolean;
    create_time: Date;
    update_time: Date;
    roles: Role[];
}
