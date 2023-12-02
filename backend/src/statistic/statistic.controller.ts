import { UserBookingCountDto } from './dto/user-booking-count.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { RequireLogin } from 'src/common/decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MeetingRoomBookingCountDto } from './dto/meeting-room-booking-count.dto';

@Controller('statistic')
@RequireLogin()
@ApiBearerAuth()
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Post('user_booking_count')
  async getUserBookingCount(@Body() userBookingCountDto: UserBookingCountDto) {
    return this.statisticService.getUserBookingCount(userBookingCountDto);
  }

  @Post('meeting_room_booking_count')
  async getMeetingRoomBookingCount(
    @Body() meetingRoomBookingCountDto: MeetingRoomBookingCountDto,
  ) {
    return this.statisticService.getMeetingRoomBookingCount(
      meetingRoomBookingCountDto,
    );
  }
}
