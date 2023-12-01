import { ApiProperty } from '@nestjs/swagger';
import { Equipment } from '../entities/equipment.entity';

export class EquipmentVo {
  @ApiProperty({
    description: '设备id',
  })
  id: number;
  @ApiProperty({
    description: '设备名称',
  })
  name: string;
  @ApiProperty({
    description: '设备描述',
    required: false,
    default: '',
  })
  description: string;
  @ApiProperty({
    description: '设备是否被使用',
  })
  is_used: boolean;
  @ApiProperty({
    description: '设备创建时间',
  })
  create_time: number;
  @ApiProperty({
    description: '关联会议室id',
    required: false,
  })
  meeting_room_id: number | null;

  constructor(equipment?: Equipment) {
    if (equipment) {
      this.id = equipment.id;
      this.name = equipment.name;
      this.description = equipment.description;
      this.is_used = !!equipment.mettingRoom;
      this.create_time = equipment.create_time.getTime();
      this.meeting_room_id = equipment.mettingRoom?.id ?? null;
    }
  }
}
