import { ApiProperty } from '@nestjs/swagger';

export class MeetingRoomBookingCountVo {
  @ApiProperty({
    description: '会议室id',
  })
  meeting_room_id: number;
  @ApiProperty({
    description: '会议室名称',
  })
  meeting_room_name: string;
  @ApiProperty({
    description: '会议室预定次数',
  })
  count: string;
}
