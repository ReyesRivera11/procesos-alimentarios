import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto, ChangePasswordDto } from './dto/update-alumno.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Alumnos } from './schemas/alumno-schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AlumnosService {
  constructor(@InjectModel(Alumnos.name) private alusmosModel: Model<Alumnos>) { }
  async create(createAlumnoDto: CreateAlumnoDto) {
    const hasedPassword = await bcrypt.hash(createAlumnoDto.password, 10);
    const res = new this.alusmosModel(
      {
        ...createAlumnoDto,
        password: hasedPassword,
      }
    );

    await res.save();
    return res;
  }

  async findAll() {
    const res = await this.alusmosModel.find().select('-password').lean().exec();
    return res;
  }

  findOne(id: string) {
    return this.alusmosModel.findById(id).select("-password");
  }

  async changePassword(id: string, changePasswordVal: ChangePasswordDto) {
    try {
      const user = await this.alusmosModel.findById(id);

      if (!user) throw new NotFoundException("El alumno no se encuentra registrado.");

      if (user.password === changePasswordVal.actualPassword) {
        const { password } = changePasswordVal;

        const hasedPassword = await bcrypt.hash(password, 10);

        return this.alusmosModel.findByIdAndUpdate(id, { password: hasedPassword }, { new: true });
      }
      const isPasswordValis = await bcrypt.compare(changePasswordVal.actualPassword, user.password);
      if (!isPasswordValis) throw new BadRequestException("Contraseña actual incorrecta.");

      const { password } = changePasswordVal;

      const hasedPassword = await bcrypt.hash(password, 10);

      return this.alusmosModel.findByIdAndUpdate(id, { password: hasedPassword }, { new: true });


    } catch (error) {
      if (error instanceof HttpException) {

        throw error;

      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);

    }

  }

  update(id: string, updateAlumnoDto: UpdateAlumnoDto) {

    return this.alusmosModel.findByIdAndUpdate(id, updateAlumnoDto, { new: true });
  }

  remove(id: string) {
    return this.alusmosModel.findByIdAndDelete(id);
  }
}
