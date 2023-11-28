import { Inject, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Transporter, createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EmailService {
  transport: Transporter;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.transport = createTransport({
      host: configService.get('EMAIL_HOST'),
      port: configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get('EMAIL_AUTH_USER'),
        pass: configService.get('EMAIL_AUTH_PASS'),
      },
    });
  }

  senEmail(info: Pick<Mail.Options, 'to' | 'subject' | 'html'>) {
    return this.transport.sendMail({
      ...info,
      from: {
        name: '会议室预定系统',
        address: this.configService.get('EMAIL_FROM_ADDRESS'),
      },
    });
  }
  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
