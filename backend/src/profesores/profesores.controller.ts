import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesoreDto } from './dto/create-profesore.dto';
import { ChangePasswordDto, UpdateProfesoreDto } from './dto/update-profesore.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) { }

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createProfesoreDto: CreateProfesoreDto) {
    return this.profesoresService.create(createProfesoreDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  findOne(@Param('id') id: string) {
    const res = this.profesoresService.findOne(id);
    if(!res) throw new NotFoundException("El profesor no se encuentra registrado");
    return res;
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateProfesoreDto: UpdateProfesoreDto) {
    const res = await this.profesoresService.update(id, updateProfesoreDto);
    if(!res) throw new NotFoundException("El profesor no se encuentra registrado.");
    return res;
  }

  @Patch('change-pass-docente/:id')
  @Auth(Role.DOCENTE)
  async changePassword(@Param('id') id: string, @Body() changePass: ChangePasswordDto) {
    const res = await this.profesoresService.changePassword(id, changePass);
    if(!res) throw new NotFoundException("El profesor no se encuentra registrado.");
    return res;
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const res = await this.profesoresService.remove(id);   
    if(!res) throw new NotFoundException("El profesor no se encuentra registrado.");
    return res;
  }

}
