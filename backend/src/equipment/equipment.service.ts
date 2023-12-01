import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { In, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class EquipmentService {
  @InjectRepository(Equipment)
  private readonly equipmentRepository: Repository<Equipment>;

  create(createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentRepository.insert(createEquipmentDto);
  }

  findAll(include_used: boolean) {
    return this.equipmentRepository.find({
      where: {
        mettingRoom: include_used ? undefined : IsNull(),
      },
      relations: ['mettingRoom'],
    });
  }
  findByIds(ids: number[], needMeetingRoom = false) {
    return this.equipmentRepository.find({
      where: { id: In(ids) },
      relations: needMeetingRoom ? ['mettingRoom'] : undefined,
    });
  }

  async findOne(id: number) {
    return this.equipmentRepository.findOneBy({ id });
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    const equipment = await this.findOne(id);
    if (!equipment) throw new BadRequestException('更新设备不存在');
    await this.equipmentRepository.update(id, updateEquipmentDto);
    return '更新成功';
  }

  remove(id: number) {
    return this.equipmentRepository.delete(id);
  }

  init() {
    const equipment1 = new Equipment();
    equipment1.name = 'name1';
    const equipment2 = new Equipment();
    equipment2.name = 'name1';

    const equipment3 = new Equipment();
    equipment3.name = 'name1';

    const meetingRoom = new MeetingRoom();
    meetingRoom.name = 'ad';
    meetingRoom.location = '1';
    meetingRoom.capacity = 1;

    equipment1.mettingRoom = meetingRoom;
    equipment2.mettingRoom = meetingRoom;
    this.equipmentRepository.save([equipment1, equipment2, equipment3]);
  }
}
