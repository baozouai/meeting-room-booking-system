import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ListBookingDto } from './dto/List-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import {
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { UserService } from 'src/user/user.service';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';

@Injectable()
export class BookingService {
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(MeetingRoomService)
  private readonly meetingRoomService: MeetingRoomService;

  @InjectRepository(Booking)
  private readonly bookingRepository: Repository<Booking>;

  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
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

  apply(id: number) {
    return this.bookingRepository.update(id, {
      status: BookingStatus.APPROVED,
    });
  }

  reject(id: number) {
    return this.bookingRepository.update(id, {
      status: BookingStatus.REJECTED,
    });
  }

  unbind(id: number) {
    return this.bookingRepository.update(id, {
      status: BookingStatus.RELIEVED,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
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
