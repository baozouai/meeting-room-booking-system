import { Equipment } from '../entities/equipment.entity';

export class EquipmentVo {
  id: number;
  name: string;
  description: string;
  is_used: boolean;
  create_time: number;
  meeting_room_id: number | null;

  constructor(equipment?: Equipment) {
    if (equipment) {
      this.id = equipment.id;
      this.name = equipment.name;
      this.description = equipment.description;
      this.is_used = equipment.is_used;
      this.create_time = equipment.create_time.getTime();
      this.meeting_room_id = equipment.mettingRoom?.id ?? null;
    }
  }
}
