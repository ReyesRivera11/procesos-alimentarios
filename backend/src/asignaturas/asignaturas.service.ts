import { Injectable } from '@nestjs/common';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Asignaturas } from './schemas/asignatura-schema';
import { Model } from 'mongoose';
@Injectable()
export class AsignaturasService {

  constructor(@InjectModel(Asignaturas.name) private asignaturasModel:Model<Asignaturas>){}

  async create(createAsignaturaDto: CreateAsignaturaDto) {
    const res =  new this.asignaturasModel(createAsignaturaDto);
    return res.save();
  };

  findAll() {
    return this.asignaturasModel.find();
  }

  async findOne(id: string) {
    return this.asignaturasModel.findOne({_id:id});
  }

  async update(id: string, updateAsignaturaDto: UpdateAsignaturaDto) {
    return this.asignaturasModel.findByIdAndUpdate(id,updateAsignaturaDto,{new:true});
  }

  async remove(id: string) {
    return this.asignaturasModel.findByIdAndDelete(id);
  }
}
