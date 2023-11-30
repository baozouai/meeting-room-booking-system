import { MeetingRoom } from '../entities/meeting-room.entity';
import { EquipmentVo } from 'src/equipment/vo/equipment.vo';

export class MeetingRoomVo {
  id: number;
  name: string;
  description: string;
  location: string;
  capacity: number;
  booked: boolean;
  create_time: number;
  update_time: number;
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
