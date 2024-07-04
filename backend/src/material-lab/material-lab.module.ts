import { Module } from '@nestjs/common';
import { MaterialLabService } from './material-lab.service';
import { MaterialLabController } from './material-lab.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialesLab, MaterialesLabSchema } from './schemas/material-lab-schema';

@Module({
  imports:[MongooseModule.forFeature([{name:MaterialesLab.name,schema:MaterialesLabSchema}])],
  controllers: [MaterialLabController],
  providers: [MaterialLabService],
})
export class MaterialLabModule {}
