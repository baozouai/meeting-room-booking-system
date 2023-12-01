import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { MeetingRoom } from '../entities/meeting-room.entity';
import { EquipmentVo } from 'src/equipment/vo/equipment.vo';

export class MeetingRoomVo {
  @ApiProperty({
    description: '会议室id',
  })
  id: number;
  @ApiProperty({
    description: '会议室名称',
  })
  name: string;
  @ApiProperty({
    description: '会议室描述',
    required: false,
    default: '',
  })
  description: string;
  @ApiProperty({
    description: '会议室位置',
  })
  location: string;
  @ApiProperty({
    description: '会议室容纳人数',
  })
  capacity: number;
  @ApiProperty({
    description: '会议室是否被预定',
  })
  booked: boolean;
  @ApiProperty({
    description: '会议室创建时间',
  })
  create_time: number;
  @ApiProperty({
    description: '会议室更新时间',
  })
  update_time: number;
  @ApiProperty({
    description: '会议室关联设备',
    type: [EquipmentVo],
  })
  equipments: EquipmentVo[];

  constructor(meetingRoom?: MeetingRoom) {
    if (meetingRoom) {
      this.id = meetingRoom.id;
      this.name = meetingRoom.name;
      this.description = meetingRoom.description;
      this.location = meetingRoom.location;
      this.capacity = meetingRoom.capacity;
      this.booked = meetingRoom.booked;
      this.create_time = meetingRoom.create_time.getTime();
      this.update_time = meetingRoom.update_time.getTime();
      this.equipments = meetingRoom.equipments.map(
        (equipment) => new EquipmentVo(equipment),
      );
    }
  }
}
