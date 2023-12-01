import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString({
    message: '会议室名称必须是字符串',
  })
  @IsNotEmpty({
    message: '会议室名称不能为空',
  })
  @Length(1, 50, {
    message: '会议室名称长度必须在1-50之间',
  })
  @Column({
    comment: '会议室名称',
    unique: true,
    length: 50,
  })
  name: string;

  @IsString({
    message: '会议室位置必须是字符串',
  })
  @IsNotEmpty({
    message: '会议室位置不能为空',
  })
  @Length(1, 50, {
    message: '会议室位置长度必须在1-50之间',
  })
  @Column({
    comment: '会议室位置',
    length: 50,
  })
  location: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsNotEmpty({
    message: '会议室容量不能为空',
  })
  @MinLength(1, {
    message: '会议室容量必须大于0',
  })
  @Column({
    comment: '会议室容量',
  })
  capacity: number;

  @IsBoolean({
    message: '会议室是否预定必须是布尔值',
  })
  @Column({
    comment: '会议室是否预定',
    default: false,
  })
  booked: boolean;

  @MaxLength(100, {
    message: '会议室描述长度不能超过100',
  })
  @Column({
    comment: '会议室描述',
    length: 100,
    default: '',
  })
  description: string;

  @OneToMany(() => Equipment, (equipment) => equipment.mettingRoom, {
    cascade: true,
  })
  @JoinTable({
    name: 'meeting_room_equipment',
  })
  equipments: Equipment[];

  @CreateDateColumn({
    comment: '创建时间',
  })
  create_time: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  update_time: Date;

  constructor(partial?: Partial<MeetingRoom>) {
    if (partial) {
      const { name, description, capacity, booked, equipments, location } =
        partial;
      if (name) this.name = name;
      if (location) this.location = location;
      if (description !== undefined) this.description = description;
      if (capacity) this.capacity = capacity;
      if (booked !== undefined) this.booked = booked;
      if (equipments) this.equipments = equipments;
    }
  }
}
