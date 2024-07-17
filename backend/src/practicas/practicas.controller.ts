import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { PracticasService } from './practicas.service';
import { CreatePracticaDto } from './dto/create-practica.dto';
import { UpdatePracticaDto } from './dto/update-practica.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

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

  @Get('/practicas-disponibles')
  @Auth(Role.ALUMNO)
  findAvailable(@Query('cuatrimestre') cuatrimestre: string, @Query('grupo') grupo: string) {
    return this.practicasService.findAvailable({ cuatrimestre, grupo });
  }

  @Get('practicas-docente/:id')
  findPracticasByDocente(@Param('id') id: string) {
    return this.practicasService.findPracticasByDocente(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.practicasService.findOne(id);
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
