import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesoreDto } from './dto/create-profesore.dto';
import { ChangePasswordDto, UpdateProfesoreDto } from './dto/update-profesore.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profesores } from './schemas/profesores-schema';
import { Model } from 'mongoose';
import { Asignaturas } from 'src/asignaturas/schemas/asignatura-schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectModel(Profesores.name) private profesoresModel: Model<Profesores>,
  ) { };

  async create(createProfesoreDto: CreateProfesoreDto): Promise<Profesores> {
    const profesor = await this.profesoresModel.find({ correo: createProfesoreDto.correo });

    if (profesor.length > 0) {
      throw new ConflictException("El correo ya se encuentra registrado.");
    }
    const res = new this.profesoresModel(createProfesoreDto);
    await res.save();
    return res;

  }

  async findAll(): Promise<Profesores[]> {
    return this.profesoresModel.find().populate("materias", "nombre cuatrimestre", Asignaturas.name)
  }

  async findOne(id: string): Promise<Profesores> {
    return this.profesoresModel.findById(id).populate("materias", "nombre cuatrimestre", Asignaturas.name);
  }

  async changePassword(id: string, changePasswordVal: ChangePasswordDto) {
    try {
      const user = await this.profesoresModel.findById(id);

      if (!user) throw new NotFoundException("El docente no se encuentra registrado.");

      if (user.password === changePasswordVal.actualPassword) {
        const { password } = changePasswordVal;

        const hasedPassword = await bcrypt.hash(password, 10);

        return this.profesoresModel.findByIdAndUpdate(id, { password: hasedPassword }, { new: true });
      }
      const isPasswordValis = await bcrypt.compare(changePasswordVal.actualPassword, user.password);
      if (!isPasswordValis) throw new BadRequestException("Contraseña actual incorrecta.");

      const { password } = changePasswordVal;

      const hasedPassword = await bcrypt.hash(password, 10);

      return this.profesoresModel.findByIdAndUpdate(id, { password: hasedPassword }, { new: true });


    } catch (error) {
      if (error instanceof HttpException) {

        throw error;

      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);

    }

  }

  async update(id: string, updateProfesoreDto: UpdateProfesoreDto): Promise<Profesores> {
    return this.profesoresModel.findByIdAndUpdate(id, updateProfesoreDto, { new: true });
  }

  async remove(id: string): Promise<Profesores> {
    return this.profesoresModel.findByIdAndDelete(id);
  }

}
