import { Injectable } from '@nestjs/common';
import { CreateMaterialInventarioDto } from './dto/create-material-inventario.dto';
import { UpdateMaterialInventarioDto } from './dto/update-material-inventario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MaterialesAlmacen } from './schema/material-almacen';
import { Model } from 'mongoose';

@Injectable()
export class MaterialInventarioService {
  constructor(@InjectModel(MaterialesAlmacen.name) private materialAlmacenModel:Model<MaterialesAlmacen>){}

  async create(createMaterialInventarioDto: CreateMaterialInventarioDto) {
    const res = new this.materialAlmacenModel(createMaterialInventarioDto);
    await res.save();
    return res;
  }

  findAll() {
    return this.materialAlmacenModel.find();
  }

  findOne(id: string) {
    return this.materialAlmacenModel.findById(id);
  }

  update(id: string, updateMaterialInventarioDto: UpdateMaterialInventarioDto) {
    return this.materialAlmacenModel.findByIdAndUpdate(id,updateMaterialInventarioDto,{new: true});
  }

  remove(id: string) {
    return this.materialAlmacenModel.findByIdAndDelete(id);
  }
}
