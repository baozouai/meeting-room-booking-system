import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    transport: Transporter;
    constructor(configService: ConfigService);
    senEmail(info: Pick<Mail.Options, 'to' | 'subject' | 'html'>): Promise<any>;
    create(createEmailDto: CreateEmailDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEmailDto: UpdateEmailDto): string;
    remove(id: number): string;
}
