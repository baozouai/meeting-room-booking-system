import { MeetingRoomBookingCountVo } from './vo/meeting-room-booking-count.vo';
import { UserBookingCountDto } from './dto/user-booking-count.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { RequireLogin } from 'src/common/decorator';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { MeetingRoomBookingCountDto } from './dto/meeting-room-booking-count.dto';
import { UserBookingCountVo } from './vo/user-booking-count.vo';

@Controller('statistic')
@RequireLogin()
@ApiBearerAuth()
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @ApiBody({
    type: UserBookingCountDto,
  })
  @ApiOkResponse({
    type: [UserBookingCountVo],
  })
  @Post('user_booking_count')
  async getUserBookingCount(@Body() userBookingCountDto: UserBookingCountDto) {
    return this.statisticService.getUserBookingCount(userBookingCountDto);
  }
  @ApiBody({
    type: MeetingRoomBookingCountDto,
  })
  @ApiOkResponse({
    type: [MeetingRoomBookingCountVo],
  })
  @Post('meeting_room_booking_count')
  async getMeetingRoomBookingCount(
    @Body() meetingRoomBookingCountDto: MeetingRoomBookingCountDto,
  ) {
    return this.statisticService.getMeetingRoomBookingCount(
      meetingRoomBookingCountDto,
    );
  }
}
