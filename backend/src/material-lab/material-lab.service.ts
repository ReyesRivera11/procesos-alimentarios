import { Injectable } from '@nestjs/common';
import { CreateMaterialLabDto } from './dto/create-material-lab.dto';
import { UpdateMaterialLabDto } from './dto/update-material-lab.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MaterialesLab } from './schemas/material-lab-schema';
import { Model } from 'mongoose';

@Injectable()
export class MaterialLabService {
  constructor(@InjectModel(MaterialesLab.name) private materialesLabModel:Model<MaterialesLab>){}
  async create(createMaterialLabDto: CreateMaterialLabDto) {
    const res = new this.materialesLabModel(createMaterialLabDto);
    await res.save();
    return res;
  }

  findAll() {
    return this.materialesLabModel.find();
  }

  findOne(id: string) {
    return this.materialesLabModel.findById(id);
  }

  update(id: string, updateMaterialLabDto: UpdateMaterialLabDto) {
    return this.materialesLabModel.findByIdAndUpdate(id, updateMaterialLabDto,{new: true});
  }

  remove(id: string) {
    return this.materialesLabModel.findByIdAndDelete(id);
  }
}
