import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoomController } from './meeting-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { EquipmentModule } from 'src/equipment/equipment.module';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom]), EquipmentModule],

  controllers: [MeetingRoomController],
  providers: [MeetingRoomService],
})
export class MeetingRoomModule {}
