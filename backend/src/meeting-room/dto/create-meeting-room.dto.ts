import { IsNumber, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateMeetingRoomDto {
  @IsString()
  @IsNotEmpty({
    message: '会议室名称不能为空',
  })
  /** 会议室名称 */
  name: string;
  @IsString()
  @IsNotEmpty({
    message: '会议室位置不能为空',
  })
  /** 位置 */
  location: string;
  @IsNumber()
  @IsNotEmpty({
    message: '会议室容量不能为空',
  })
  /** 容纳人数 */
  capacity: number;
  @IsString()
  @MaxLength(200, {
    message: '会议室描述长度不能超过200',
  })
  /** 描述 */
  description?: string;
  /** 设备id列表 */
  equipment_ids?: number[];
}
