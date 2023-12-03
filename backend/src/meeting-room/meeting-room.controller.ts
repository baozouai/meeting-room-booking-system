import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoomVo } from './vo/meeting-room.vo';
import { RequireLogin } from 'src/common/decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('会议室')
@Controller('meeting-room')
@RequireLogin()
@ApiBearerAuth()
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('create')
  async create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    await this.meetingRoomService.create(createMeetingRoomDto);
    return '创建成功';
  }

  @Get('list')
  async findList(
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

  @Get('delete')
  async remove(@Query('id') id: number) {
    await this.meetingRoomService.remove(id);
    return '删除成功';
  }
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiOkResponse({
    description: '查询成功',
    type: MeetingRoomVo,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const meetingRoom = await this.meetingRoomService.findOne(id);
    return new MeetingRoomVo(meetingRoom);
  }
  @Post('update')
  async update(
    @Body('id') id: number,
    @Body() updateMeetingRoomDto: UpdateMeetingRoomDto,
  ) {
    await this.meetingRoomService.update(id, updateMeetingRoomDto);
    return '更新成功';
  }
}
