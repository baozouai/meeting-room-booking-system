import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoomVo } from './vo/meeting-room.vo';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('create')
  async create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    await this.meetingRoomService.create(createMeetingRoomDto);
    return '创建成功';
  }

  @Get()
  findAll() {
    return this.meetingRoomService.findAll();
  }

  @Get('list')
  async findOne(
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment_ids') equipment_ids: number[],
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    const [meeting_rooms, total_counts] =
      await this.meetingRoomService.findMeetingRooms(
        offset,
        limit,
        name,
        capacity,
        equipment_ids,
      );

    return {
      meeting_rooms: meeting_rooms.map(
        (meeting_room) => new MeetingRoomVo(meeting_room),
      ),
      total_counts,
    };
  }
}
