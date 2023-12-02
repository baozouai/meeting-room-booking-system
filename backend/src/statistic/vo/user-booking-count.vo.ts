import { ApiProperty } from '@nestjs/swagger';

export class UserBookingCountVo {
  @ApiProperty({
    description: '用户id',
  })
  user_id: number;
  @ApiProperty({
    description: '用户名',
  })
  user_name: string;
  @ApiProperty({
    description: '用户预定次数',
  })
  count: string;
}
