import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RequireLogin } from 'src/common/decorator';
import { ListBookingDto } from './dto/List-booking.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('booking')
@RequireLogin()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    const [bookings, totalCount] = this.bookingService.create(createBookingDto);
    return {
      bookings,
      totalCount,
    };
  }
  /** 预订列表 */
  @Post('list')
  async list(@Body() listBookingDto: ListBookingDto) {
    const [bookings, totalCount] =
      await this.bookingService.findAll(listBookingDto);
    return {
      bookings,
      totalCount,
    };
  }
  /** 审批预订申请 */
  @Get('approve')
  approve() {
    // return this.bookingService.findAll();
  }
  /** 申请预订 */
  @Get('add')
  add() {
    // return this.bookingService.findAll();
  }
  @ApiParam({
    name: 'id',
    description: '预订id',
  })
  /** 通过预订 */
  @Get('apply/:id')
  async apply(@Param('id', ParseIntPipe) id: number) {
    await this.bookingService.apply(id);
    return '审批通过';
  }
  @ApiParam({
    name: 'id',
    description: '取消预订id',
  })
  /** 取消预订 */
  @Get('reject/:id')
  async reject(@Param('id', ParseIntPipe) id: number) {
    await this.bookingService.reject(id);
    return '已驳回';
  }
  @ApiParam({
    name: 'id',
    description: '解除预订id',
  })
  /** 解除预定 */
  @Get('unbind/:id')
  async unbind(@Param('id', ParseIntPipe) id: number) {
    await this.bookingService.unbind(id);
    return '已解除';
  }
  /** 催办 */
  @Get('urge')
  urge() {
    // return this.bookingService.findAll();
  }
  /** 预定历史 */
  @Get('history')
  history() {
    // return this.bookingService.findAll();
  }
}
