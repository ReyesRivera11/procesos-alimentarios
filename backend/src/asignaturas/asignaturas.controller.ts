import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, HttpCode } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) { }

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createAsignaturaDto: CreateAsignaturaDto) {
    try {
      return await this.asignaturasService.create(createAsignaturaDto);
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("La meteria ya existe.");
      throw error
    }

  }

  @Get()
  @Auth(Role.ADMIN)
  findAll() {
    return this.asignaturasService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    const materia = await this.asignaturasService.findOne(id);
    if (!materia) throw new NotFoundException("La materia no fue encontrada");
    return materia;
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateAsignaturaDto: UpdateAsignaturaDto) {
    try {
      const materia = await this.asignaturasService.update(id, updateAsignaturaDto);
      if (!materia) throw new NotFoundException("La materia no se encuentra registrada");
      return materia;
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("La meteria ya existe.");
      throw error;
    }

  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const materia = await this.asignaturasService.remove(id);
    if (!materia) throw new NotFoundException("La materia no se encuentra registrada");
    return materia;
  }
}
