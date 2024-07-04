import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { PracticasService } from './practicas.service';
import { CreatePracticaDto } from './dto/create-practica.dto';
import { UpdatePracticaDto } from './dto/update-practica.dto';

@Controller('practicas')
export class PracticasController {
  constructor(private readonly practicasService: PracticasService) {}

  @Post()
  create(@Body() createPracticaDto: CreatePracticaDto) {
    return this.practicasService.create(createPracticaDto);
  }

  @Get()
  findAll() {
    return this.practicasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.practicasService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePracticaDto: UpdatePracticaDto) {
    const res = await this.practicasService.update(id, updatePracticaDto);
    if(!res) throw new NotFoundException("La practica no existe.")
    return res;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.practicasService.remove(id);
    if(!res) throw new NotFoundException("La practica no existe.")
    return res;
  }
}
