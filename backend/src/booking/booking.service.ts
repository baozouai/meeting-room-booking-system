import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ListBookingDto } from './dto/List-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UserService } from 'src/user/user.service';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';
import { ConfigService } from '@nestjs/config';
import { isEmail } from 'class-validator';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { RequireLogin } from 'src/common/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('预定')
@Injectable()
@RequireLogin()
@ApiBearerAuth()
export class BookingService {
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(MeetingRoomService)
  private readonly meetingRoomService: MeetingRoomService;

  @InjectRepository(Booking)
  private readonly bookingRepository: Repository<Booking>;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const { start_time, end_time, meeting_room_id, remark } = createBookingDto;
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    const exist = await this.bookingRepository.findOneBy([
      {
        start_time: Between(startDate, endDate),
      },
      {
        end_time: Between(startDate, endDate),
      },
    ]);
    if (exist) throw new BadRequestException('该时间段已被预定');

    const user = await this.userService.findOneUserBy({
      id: userId,
    });
    const meetingRoom = await this.meetingRoomService.findOne(meeting_room_id);
    const booking = new Booking({
      start_time: startDate,
      end_time: endDate,
      remark,
      meeting_room: meetingRoom,
      user,
    });

    await this.bookingRepository.insert(booking);
  }
  findOne(id: number) {
    return this.bookingRepository.findOneBy({ id });
  }

  findAll(listBookingDto: ListBookingDto) {
    const {
      booking_user,
      meeting_room_location,
      meeting_room_name,
      start_time,
      end_time,
      status,
      offset,
      limit,
    } = listBookingDto;
    return this.bookingRepository.findAndCount({
      where: {
        user: {
          username: booking_user ? Like(`%${booking_user}%`) : undefined,
        },
        meeting_room: {
          location: meeting_room_location
            ? Like(`%${meeting_room_location}%`)
            : undefined,
          name: meeting_room_name ? Like(`%${meeting_room_name}%`) : undefined,
        },
        status,
        start_time: start_time
          ? MoreThanOrEqual(new Date(start_time))
          : undefined,
        end_time: end_time ? LessThanOrEqual(new Date(end_time)) : undefined,
      },
      skip: offset,
      take: limit,
      relations: {
        user: true,
        meeting_room: true,
      },
      order: {
        start_time: 'ASC',
      },
    });
  }

  changeStatus(id: number, status: BookingStatus) {
    return this.bookingRepository.update(id, {
      status,
    });
  }

  async urge(id: number, username: string) {
    const redisCacheKey = `urge_booking_${id}`;
    const hasCache = await this.redisService.get(redisCacheKey);
    if (hasCache)
      throw new BadRequestException('半小时内只能催办一次，请耐心等待');

    let adminEmail = this.configService.get('ADMIN_EMAIL');
    if (!isEmail(adminEmail)) {
      const adminUser = await this.userService.findOneUserBy({
        is_admin: true,
      });
      adminEmail = adminUser.email;
    }
    await this.emailService.senEmail({
      to: adminEmail,
      subject: `用户${username}催单`,
      html: `<a href="http://localhost:3001/booking_manage/${id}">点击审批</a>`,
    });
    this.redisService.set(redisCacheKey, '1', 60 * 30);
  }

  async init() {
    const booking1 = new Booking();
    booking1.start_time = new Date();
    booking1.end_time = new Date();
    booking1.end_time.setHours(booking1.end_time.getHours() + 1);

    booking1.status = BookingStatus.APPLYING;
    booking1.remark = 'remark';

    const booking2 = new Booking();
    booking2.start_time = new Date();
    booking2.start_time.setHours(booking1.start_time.getHours() + 1);

    booking2.end_time = new Date();
    booking2.end_time.setHours(booking1.end_time.getHours() + 1);

    booking2.status = BookingStatus.APPROVED;
    booking2.remark = 'remark';

    const booking3 = new Booking();
    booking3.start_time = new Date();
    booking3.start_time.setHours(booking2.start_time.getHours() + 1);

    booking3.end_time = new Date();
    booking3.end_time.setHours(booking2.end_time.getHours() + 1);

    booking3.status = BookingStatus.REJECTED;
    booking3.remark = 'remark';

    const booking4 = new Booking();
    booking4.start_time = new Date();
    /** 一小时之后 */
    booking4.end_time = new Date();
    booking4.end_time.setHours(booking3.start_time.getHours() + 1);
    booking4.end_time.setHours(booking3.end_time.getHours() + 1);
    booking4.status = BookingStatus.RELIEVED;

    booking4.remark = 'remark';

    const user1 = await this.userService.findOneUserBy({ id: 1 });
    const user2 = await this.userService.findOneUserBy({ id: 2 });
    const user3 = await this.userService.findOneUserBy({ id: 7 });
    const user4 = await this.userService.findOneUserBy({ id: 9 });

    const meetingRoom1 = await this.meetingRoomService.findOne(4);
    const meetingRoom2 = await this.meetingRoomService.findOne(5);

    booking1.user = user1;
    booking1.meeting_room = meetingRoom1;

    booking2.user = user2;
    booking2.meeting_room = meetingRoom1;

    booking3.user = user3;
    booking3.meeting_room = meetingRoom1;

    booking4.user = user4;
    booking4.meeting_room = meetingRoom2;

    await this.bookingRepository.save([booking1, booking2, booking3, booking4]);

    return '初始化成功';
  }
}
