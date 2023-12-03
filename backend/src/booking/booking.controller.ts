import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RequireLogin, UserInfo } from 'src/common/decorator';
import { ListBookingDto } from './dto/List-booking.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BookingStatus } from './entities/booking.entity';
import { generateParseIntPipe } from 'src/utils';
import { HistoryBookingDto } from './dto/history-booking.dto';

@ApiTags('预定')
@Controller('booking')
@RequireLogin()
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(
    @UserInfo('userId') userId: number,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    await this.bookingService.create(userId, createBookingDto);
    return '预定成功';
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
  @Get('get')
  async getBooking(@Query('id', generateParseIntPipe('id')) id: number) {
    const booking = await this.bookingService.findOne(id);
    if (!booking) throw new BadRequestException('没有该预定记录');
    return {
      booking,
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
  @ApiOkResponse({
    description: '审批通过',
  })
  /** 通过预订 */
  @Get('apply/:id')
  async apply(@Param('id', generateParseIntPipe('id')) id: number) {
    await this.bookingService.changeStatus(id, BookingStatus.APPROVED);
    return '审批通过';
  }

  @ApiParam({
    name: 'id',
    description: '取消预订id',
  })
  @ApiOkResponse({
    description: '已驳回',
  })
  /** 取消预订 */
  @Get('reject/:id')
  async reject(@Param('id', generateParseIntPipe('id')) id: number) {
    await this.bookingService.changeStatus(id, BookingStatus.REJECTED);
    return '已驳回';
  }
  @ApiParam({
    name: 'id',
    description: '解除预订id',
  })
  @ApiOkResponse({
    description: '已解除',
  })
  /** 解除预定 */
  @Get('unbind/:id')
  async changeStatus(@Param('id', generateParseIntPipe('id')) id: number) {
    await this.bookingService.changeStatus(id, BookingStatus.RELIEVED);
    return '已解除';
  }

  @ApiParam({
    name: 'id',
    description: '催办预订id',
  })
  @ApiQuery({
    name: 'username',
    description: '催办人',
  })
  @ApiOkResponse({
    description: '催办成功',
  })
  /** 催办 */
  @Get('urge/:id')
  async urge(
    @Param('id', generateParseIntPipe('id')) id: number,
    @Query('username') username: string,
  ) {
    await this.bookingService.urge(id, username);
    return '催办成功';
  }
  @ApiParam({
    name: 'user',
  })
  /** 预定历史 */
  @Post('history')
  async history(
    @UserInfo('userId') userId: number,
    @Body() historyBookingDto: HistoryBookingDto,
  ) {
    const [bookings, totalCount] = await this.bookingService.history(
      userId,
      historyBookingDto,
    );
    return {
      bookings,
      totalCount,
    };
  }
}
