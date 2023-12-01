import { IsNotEmpty, IsString, Length } from 'class-validator';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString({
    message: '设备名称必须是字符串',
  })
  @IsNotEmpty({
    message: '设备名称不能为空',
  })
  @Length(1, 50, {
    message: '设备名称长度必须在1-50之间',
  })
  @Column({
    comment: '设备名称',
  })
  name: string;
  @Column({
    comment: '设备描述',
    default: '',
  })
  description: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  create_time: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  update_time: Date;
  @JoinColumn({
    name: 'meeting_room_id',
  })
  @ManyToOne(() => MeetingRoom, {
    onDelete: 'SET NULL',
  })
  mettingRoom: MeetingRoom | null;
}
