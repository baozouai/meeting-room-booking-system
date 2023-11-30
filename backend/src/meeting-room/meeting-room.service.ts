import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentService } from 'src/equipment/equipment.service';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private readonly meetingRoomRepository: Repository<MeetingRoom>;
  @Inject(EquipmentService)
  private readonly equipmentService: EquipmentService;

  async create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const meetingRoom = await this.meetingRoomRepository.findOneBy({
      name: createMeetingRoomDto.name,
    });
    if (meetingRoom) throw new BadRequestException('会议室已存在');
    const { equipment_ids, ...rest } = createMeetingRoomDto;
    const newMeetingRoom = new MeetingRoom(rest);
    if (equipment_ids) {
      const equipmentList =
        await this.equipmentService.findByIds(equipment_ids);
      for (const equipment of equipmentList) {
        if (equipment.is_used) throw new BadRequestException('设备已被使用');
        equipment.is_used = true;
      }
      newMeetingRoom.equipments = equipmentList;
    }
    const res = await this.meetingRoomRepository.save(newMeetingRoom);
    return res;
  }

  findAll() {
    return `This action returns all meetingRoom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meetingRoom`;
  }

  update(id: number, updateMeetingRoomDto: UpdateMeetingRoomDto) {
    return `This action updates a #${id} meetingRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} meetingRoom`;
  }

  async findMeetingRooms(
    offset: number,
    limit: number,
    name?: string,
    capacity?: number,
    equipment_ids?: number[],
  ) {
    const where: FindOptionsWhere<MeetingRoom> = {};

    if (name) where.name = Like(`%${name}%`);
    if (capacity) where.capacity = capacity;

    return this.meetingRoomRepository.findAndCount({
      skip: offset,
      take: limit,
      where,
      relations: {
        equipments: true,
      },
    });
  }
}
