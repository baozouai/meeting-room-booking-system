import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
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
      const equipmentList = await this.equipmentService.findByIds(
        equipment_ids,
        true,
      );
      const useEquipmentNames: string[] = [];
      for (const equipment of equipmentList) {
        const { name, mettingRoom } = equipment;
        if (!!mettingRoom) useEquipmentNames.push(name);
      }
      if (useEquipmentNames.length)
        throw new BadRequestException(
          `设备【${useEquipmentNames.join('、')}】已被使用`,
        );
      newMeetingRoom.equipments = equipmentList;
    }
    const res = await this.meetingRoomRepository.save(newMeetingRoom);
    return res;
  }

  findOne(id: number) {
    return this.meetingRoomRepository.findOne({
      where: {
        id,
      },
      relations: {
        equipments: {
          mettingRoom: true,
        },
      },
    });
  }

  async update(id: number, updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.findOne(id);
    if (!meetingRoom) throw new BadRequestException('会议室不存在');
    const { equipment_ids, ...restUpdateMeetingRoomDto } = updateMeetingRoomDto;
    if (equipment_ids) {
      const equipmentList = equipment_ids.length
        ? []
        : await this.equipmentService.findByIds(equipment_ids, true);

      for (const equipment of equipmentList) {
        if (!!equipment.mettingRoom)
          throw new BadRequestException('设备已被使用');
      }
      meetingRoom.equipments = equipmentList;
    }

    await this.meetingRoomRepository.save({
      ...meetingRoom,
      ...restUpdateMeetingRoomDto,
    });
  }

  remove(id: number) {
    return this.meetingRoomRepository.delete(id);
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
    if (equipment_ids?.length) {
      where.equipments = {
        id: In(equipment_ids),
      };
    }

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
