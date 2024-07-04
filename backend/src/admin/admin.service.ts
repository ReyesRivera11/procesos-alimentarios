import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Administrador } from './schemas/admin-schema';
import { Model } from 'mongoose';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Administrador.name) private adminModel:Model<Administrador>){}
  async create(createAdminDto: CreateAdminDto):Promise<Admin> {
    const hasedPassword = await bcrypt.hash(createAdminDto.password,10);
    const res =  new this.adminModel({...createAdminDto,password:hasedPassword});
    await res.save();
    return res;
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
