import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { ChangePasswordDto, UpdateAlumnoDto } from './dto/update-alumno.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) { }

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createAlumnoDto: CreateAlumnoDto) {
    try {
      return await this.alumnosService.create(createAlumnoDto);
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("La matrícula ya estaá en uso");
      throw error;
    }
  }

  @Get()
  @Auth(Role.ADMIN)
  findAll() {
    return this.alumnosService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    const res = await this.alumnosService.findOne(id);
    if (!res) throw new NotFoundException("El alumno no se encuentra registrado.")
    return res;
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    try {
      const res = await this.alumnosService.update(id, updateAlumnoDto)
      if (!res) throw new NotFoundException("El alumno no se encuentra registrado");
      return res;
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("La matrícula ya está en uso");
      throw error;
    }

  }

  @Patch("/changePassword/:id")
  @Patch(Role.ALUMNO)
  async changePassword(@Param("id") id: string, @Body() changePasswordVal: ChangePasswordDto) {
    try {
      const res = await this.alumnosService.changePassword(id, changePasswordVal);
      if (!res) throw new NotFoundException("El alumno no se encuentra registrado.");
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const res = await this.alumnosService.remove(id);
    if (!res) throw new NotFoundException("El alumno no se encuentra registrado");
    return res;
  }
}
