import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { UserModule } from 'src/user/user.module';
import { MeetingRoomModule } from 'src/meeting-room/meeting-room.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UserModule, MeetingRoomModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
