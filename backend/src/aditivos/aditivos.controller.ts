import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { AditivosService } from './aditivos.service';
import { CreateAditivoDto } from './dto/create-aditivo.dto';
import { UpdateAditivoDto } from './dto/update-aditivo.dto';

@Controller('aditivos')
export class AditivosController {
  constructor(private readonly aditivosService: AditivosService) { }

  @Post()
  async create(@Body() createAditivoDto: CreateAditivoDto) {
    try {
      return await this.aditivosService.create(createAditivoDto)
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("El aditivo ya se encuentra registrado")
      throw error;
    }

  }

  @Get()
  findAll() {
    return this.aditivosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.aditivosService.findOne(id);
    if (!res) throw new NotFoundException("El aditivo no existe.")
    return res;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAditivoDto: UpdateAditivoDto) {
    try {
      const res = await this.aditivosService.update(id, updateAditivoDto);
      if (!res) throw new NotFoundException("El aditivo no existe.")
      return res;
    } catch (error) {
      if (error.code === 11000) throw new ConflictException("El aditivo ya se encuentra registrado")
      throw error;
    }

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.aditivosService.remove(id);
    if (!res) throw new NotFoundException("El aditivo no existe.");
    return res;
  }
}
