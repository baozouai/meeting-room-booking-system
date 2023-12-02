import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: '预定开始时间',
  })
  start_time: number;
  @ApiProperty({
    description: '预定结束时间',
  })
  @ApiProperty({
    description: '会议室id',
  })
  meeting_room_id: number;
  end_time: number;
  @ApiProperty({
    description: '备注',
    maxLength: 100,
  })
  remark?: string;
}
