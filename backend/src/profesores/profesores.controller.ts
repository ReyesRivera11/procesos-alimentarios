import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesoreDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) { }

  @Post()
  async create(@Body() createProfesoreDto: CreateProfesoreDto) {
    return this.profesoresService.create(createProfesoreDto);
  }

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const res = this.profesoresService.findOne(id);
    if(!res) throw new NotFoundException("El profesor no se encuentra registrado");
    return res;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProfesoreDto: UpdateProfesoreDto) {
    const res = await this.profesoresService.update(id, updateProfesoreDto);
    if(!res) throw new NotFoundException("El profesor no se encuentra registrado.");
    return res;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.profesoresService.remove(id);   
    if(!res) throw new NotFoundException("El profesor no se encuentra registrado.");
    return res;
  }

}
