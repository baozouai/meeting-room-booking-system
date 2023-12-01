import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingStatus {
  /** 申请中 */
  APPLYING = 1,
  /** 审批通过 */
  APPROVED,
  /** 审批驳回 */
  REJECTED,
  /** 已解除 */
  RELIEVED,
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '预定开始时间',
  })
  start_time: Date;

  @Column({
    comment: '预定结束时间',
  })
  end_time: Date;

  @ManyToOne(() => User)
  @JoinTable({
    name: 'book_user_id',
  })
  user: User;

  @ManyToOne(() => MeetingRoom)
  @JoinTable({
    name: 'book_meeting_room_id',
  })
  meeting_room: MeetingRoom;

  @Column({
    comment: '预定状态',
    type: 'enum',
    enum: BookingStatus,
  })
  status: BookingStatus;

  @Column({
    comment: '预定备注',
    nullable: true,
    length: 100,
  })
  remark: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  create_time: Date;
  @UpdateDateColumn({
    comment: '更新时间',
  })
  update_time: Date;
}
