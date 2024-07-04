import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { MaterialLabService } from './material-lab.service';
import { CreateMaterialLabDto } from './dto/create-material-lab.dto';
import { UpdateMaterialLabDto } from './dto/update-material-lab.dto';

@Controller('material-lab')
export class MaterialLabController {
  constructor(private readonly materialLabService: MaterialLabService) { }

  @Post()
  async create(@Body() createMaterialLabDto: CreateMaterialLabDto) {
    try {
      return await this.materialLabService.create(createMaterialLabDto);
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("El material ya se encuentra registro.");
    }

  }

  @Get()
  findAll() {
    return this.materialLabService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.materialLabService.findOne(id);
    if (!res) throw new NotFoundException("El material no se encuentra registro.");
    return res;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMaterialLabDto: UpdateMaterialLabDto) {
    try {
      const res = await this.materialLabService.update(id, updateMaterialLabDto);
      if (!res) throw new NotFoundException("El material no se encuentra registrado.");
      return res;
    } catch (error) {
      if(error.code === 11000) throw new NotFoundException("El nombre del material ya se encuetra en uso.");
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.materialLabService.remove(id);
    if(!res) throw new NotFoundException("El mayterial no se encuentra registrado.");
    return res;
  }
}
