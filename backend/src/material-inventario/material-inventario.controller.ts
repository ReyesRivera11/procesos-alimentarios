import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { MaterialInventarioService } from './material-inventario.service';
import { CreateMaterialInventarioDto } from './dto/create-material-inventario.dto';
import { UpdateMaterialInventarioDto } from './dto/update-material-inventario.dto';

@Controller('material-inventario')
export class MaterialInventarioController {
  constructor(private readonly materialInventarioService: MaterialInventarioService) { }

  @Post()
  async create(@Body() createMaterialInventarioDto: CreateMaterialInventarioDto) {
    try {
      return await this.materialInventarioService.create(createMaterialInventarioDto);
    } catch (error) {
      if(error.code === 11000)throw new ConflictException("El material ya se encuentra registrado.");
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.materialInventarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.materialInventarioService.findOne(id);
    if(!res) throw new NotFoundException("El material no se encuentra registrado");
    return res;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMaterialInventarioDto: UpdateMaterialInventarioDto) {
    try {
      const res = await  this.materialInventarioService.update(id, updateMaterialInventarioDto);
      if(!res) throw new NotFoundException("El material no se encuentra registrado.");
      return res;
    } catch (error) {
      if(error.code === 11000) throw new ConflictException("El nombre del material ya está en uso.");
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.materialInventarioService.remove(id);
    if(!res) throw new NotFoundException("El material no se encuentra registrado.");
    return res;
  }
}
