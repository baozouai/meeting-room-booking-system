import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateEquipmentDto {
  @IsString({
    message: '设备名称必须是字符串',
  })
  @IsNotEmpty({
    message: '设备名称不能为空',
  })
  @Length(1, 50, {
    message: '设备名称长度必须在1-50之间',
  })
  /** 设备名称 */
  name: string;
  /** 设备描述 */
  description?: string;
  /** 设备是否被使用 */
  is_used?: boolean;
  meeting_room_id?: number;
}
