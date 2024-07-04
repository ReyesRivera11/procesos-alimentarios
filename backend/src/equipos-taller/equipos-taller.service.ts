import { Injectable } from '@nestjs/common';
import { CreateEquiposTallerDto } from './dto/create-equipos-taller.dto';
import { UpdateEquiposTallerDto } from './dto/update-equipos-taller.dto';
import { InjectModel } from '@nestjs/mongoose';
import { EquiposTaller } from './schema/equipos-taller-schema';
import { Model } from 'mongoose';

@Injectable()
export class EquiposTallerService {
  constructor(@InjectModel(EquiposTaller.name) private equposTallerModel:Model<EquiposTaller>){}
  async create(createEquiposTallerDto: CreateEquiposTallerDto) {
    const res = new this.equposTallerModel(createEquiposTallerDto);
    await res.save();
    return res;
  }

  findAll() {
    return this.equposTallerModel.find();
  }

  findOne(id: string) {
    return this.equposTallerModel.findById(id);
  }

  update(id: string, updateEquiposTallerDto: UpdateEquiposTallerDto) {
    return this.equposTallerModel.findByIdAndUpdate(id,updateEquiposTallerDto,{new:true});
  }

  remove(id: string) {
    return this.equposTallerModel.findByIdAndDelete(id);
  }
}
