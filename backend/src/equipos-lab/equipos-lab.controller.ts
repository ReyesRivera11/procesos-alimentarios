import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { EquiposLabService } from './equipos-lab.service';
import { CreateEquiposLabDto } from './dto/create-equipos-lab.dto';
import { UpdateEquiposLabDto } from './dto/update-equipos-lab.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('equipos-lab')
export class EquiposLabController {
  constructor(private readonly equiposLabService: EquiposLabService) { }
  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createEquiposLabDto: CreateEquiposLabDto) {
    try {
      return await this.equiposLabService.create(createEquiposLabDto);
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("El equipo ya esta registrado.");
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.equiposLabService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.equiposLabService.findOne(id);
    if (!res) throw new NotFoundException("El equipo no esta registrado.");
    return res;
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateEquiposLabDto: UpdateEquiposLabDto) {
    try {
      const res = await this.equiposLabService.update(id, updateEquiposLabDto);
      if (!res) throw new NotFoundException("El equipo no esta registrado.");
      return res;
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("El equipo ya esta registrado.");
      throw error;
    }

  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const res = await this.equiposLabService.remove(id);
    if (!res) throw new NotFoundException("El equipo no esta registrado.");
    return res;
  }
}

