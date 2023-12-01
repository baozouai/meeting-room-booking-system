import { BookingStatus } from '../entities/booking.entity';

export class ListBookingDto {
  /** 预订人 */
  booking_user?: string;
  /** 会议室名称 */
  meeting_room_name?: string;
  /** 会议室位置 */
  meeting_room_location?: string;
  /** 预定开始时间 */
  start_time?: number;
  /** 预定结束时间 */
  end_time?: number;
  /** 预定状态 */
  status?: BookingStatus;
  /** 页码 */
  offset: number;
  /** 每页数量 */
  limit: number;
}
