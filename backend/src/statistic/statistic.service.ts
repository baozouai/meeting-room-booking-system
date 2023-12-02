import { Injectable } from '@nestjs/common';
import { UserBookingCountDto } from './dto/user-booking-count.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { User } from 'src/user/entities/user.entity';
import { MeetingRoomBookingCountDto } from './dto/meeting-room-booking-count.dto';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';

@Injectable()
export class StatisticService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async getUserBookingCount(userBookingCountDto: UserBookingCountDto) {
    const { start_date, end_date } = userBookingCountDto;

    return this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('u.username', 'username')
      .addSelect('u.id', 'user_id')
      .addSelect('COUNT(1)', 'count')
      .leftJoin(User, 'u', 'u.id = b.userId')
      .where('b.start_time between :start_date and :end_date', {
        start_date,
        end_date,
      })
      .groupBy('u.id')
      .getRawMany();
  }
  async getMeetingRoomBookingCount(
    meetingRoomBookingCountDto: MeetingRoomBookingCountDto,
  ) {
    const { start_date, end_date } = meetingRoomBookingCountDto;

    return this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('m.id', 'meeting_room_id')
      .addSelect('m.name', 'meeting_room_name')
      .addSelect('COUNT(1)', 'count')
      .leftJoin(MeetingRoom, 'm', 'm.id = b.meetingRoomId')
      .where('b.start_time between :start_date and :end_date', {
        start_date,
        end_date,
      })
      .groupBy('m.id')
      .getRawMany();
  }
}
