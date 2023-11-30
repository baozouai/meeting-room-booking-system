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
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentVo } from './vo/equipment.vo';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post('create')
  async create(@Body() createEquipmentDto: CreateEquipmentDto) {
    await this.equipmentService.create(createEquipmentDto);
    return '创建成功';
  }

  @Get()
  async findAll() {
    const equipments = await this.equipmentService.findAll(false);
    return equipments.map((equipment) => new EquipmentVo(equipment));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const equipment = await this.equipmentService.findOne(id);
    return new EquipmentVo(equipment);
  }

  @Post('update')
  update(
    @Body('id') id: number,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @Post('delete')
  remove(@Body('id') id: number) {
    return this.equipmentService.remove(id);
  }
}
