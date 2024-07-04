import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProfesoreDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profesores } from './schemas/profesores-schema';
import { Model } from 'mongoose';
import { Asignaturas } from 'src/asignaturas/schemas/asignatura-schema';

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

  async update(id: string, updateProfesoreDto: UpdateProfesoreDto): Promise<Profesores> {
    return this.profesoresModel.findByIdAndUpdate(id, updateProfesoreDto, { new: true });
  }

  async remove(id: string): Promise<Profesores> {
    return this.profesoresModel.findByIdAndDelete(id);
  }

}
