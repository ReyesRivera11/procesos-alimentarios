import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { EquiposTallerService } from './equipos-taller.service';
import { CreateEquiposTallerDto } from './dto/create-equipos-taller.dto';
import { UpdateEquiposTallerDto } from './dto/update-equipos-taller.dto';
import { arrayUnique } from 'class-validator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('equipos-taller')
export class EquiposTallerController {
  constructor(private readonly equiposTallerService: EquiposTallerService) { }

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createEquiposTallerDto: CreateEquiposTallerDto) {
    try {
      const res = await this.equiposTallerService.create(createEquiposTallerDto);
      return res;
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("El equipo ya esta registrado");
      throw error;
    }

  }

  @Get()
  findAll() {
    return this.equiposTallerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.equiposTallerService.findOne(id);
    if (!res) throw new NotFoundException("El equipo no se encuentra registrado.");
    return res;
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateEquiposTallerDto: UpdateEquiposTallerDto) {
    try {
      const res = await this.equiposTallerService.update(id, updateEquiposTallerDto);
      if (!res) throw new NotFoundException("El equipo no se encuentra registrado.");
      return res;
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("El equipo ya esta registrado");
      throw error;
    }
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const res = await this.equiposTallerService.remove(id);
    if(!res) throw new NotFoundException("El equipo no se encuentra resgistrado");
    return res;
  }
}
