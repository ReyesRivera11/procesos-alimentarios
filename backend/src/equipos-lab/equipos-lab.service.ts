import { Injectable } from '@nestjs/common';
import { CreateEquiposLabDto } from './dto/create-equipos-lab.dto';
import { UpdateEquiposLabDto } from './dto/update-equipos-lab.dto';
import { InjectModel } from '@nestjs/mongoose';
import { EquiposLab } from './schema/equipos-lab-schema';
import { Model } from 'mongoose';

@Injectable()
export class EquiposLabService {

  constructor(@InjectModel(EquiposLab.name) private equiposLabModel:Model<EquiposLab>){};

  async create(createEquiposLabDto: CreateEquiposLabDto) {
    const res =  new this.equiposLabModel(createEquiposLabDto);
    await res.save();
    return res;
  }

  findAll() {
    return this.equiposLabModel.find();
  }

  findOne(id: string) {
    return this.equiposLabModel.findById(id);
  }

  update(id: string, updateEquiposLabDto: UpdateEquiposLabDto) {
    return this.equiposLabModel.findByIdAndUpdate(id, updateEquiposLabDto,{new:true});
  }

  remove(id: string) {
    return this.equiposLabModel.findByIdAndDelete(id);
  }
}
