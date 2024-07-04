import { Module } from '@nestjs/common';
import { EquiposLabService } from './equipos-lab.service';
import { EquiposLabController } from './equipos-lab.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EquiposLab } from './entities/equipos-lab.entity';
import { SchemaEquiposLab } from './schema/equipos-lab-schema';

@Module({
  imports:[MongooseModule.forFeature([{name:EquiposLab.name,schema:SchemaEquiposLab}])],
  controllers: [EquiposLabController],
  providers: [EquiposLabService],
})
export class EquiposLabModule {}
