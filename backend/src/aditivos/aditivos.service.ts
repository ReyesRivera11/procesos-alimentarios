import { Injectable } from '@nestjs/common';
import { CreateAditivoDto } from './dto/create-aditivo.dto';
import { UpdateAditivoDto } from './dto/update-aditivo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Aditivos } from './schemas/aditivo.schema';
import { Model } from 'mongoose';

@Injectable()
export class AditivosService {
  constructor(@InjectModel(Aditivos.name) private aditivosModels:Model<Aditivos>){}
  async create(createAditivoDto: CreateAditivoDto) {
    const res = new this.aditivosModels(createAditivoDto);
    await res.save();
    return res;
  }

  findAll() {
    return this.aditivosModels.find();
  }

  findOne(id: string) {
    return this.aditivosModels.findById(id);
  }

  async update(id: string, updateAditivoDto: UpdateAditivoDto) {
    return this.aditivosModels.findByIdAndUpdate(id, updateAditivoDto,{new:true});
  }

  remove(id: string) {
    return this.aditivosModels.findByIdAndDelete(id);
  }
}
