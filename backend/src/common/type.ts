import { ApiProperty } from '@nestjs/swagger';

export class PagingParams {
  @ApiProperty({
    description: '页码',
  })
  offset: number;
  @ApiProperty({
    description: '每页数量',
  })
  limit: number;
}
