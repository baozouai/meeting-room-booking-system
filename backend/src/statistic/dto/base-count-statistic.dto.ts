import { ApiProperty } from '@nestjs/swagger';

export class BaseCountStatisticDto {
  @ApiProperty({
    description: '开始日期',
  })
  start_date: string;
  @ApiProperty({
    description: '结束日期',
  })
  end_date: string;
}
