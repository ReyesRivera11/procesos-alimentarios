import { Module } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { AsignaturasController } from './asignaturas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AsignaturaSchema, Asignaturas } from './schemas/asignatura-schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Asignaturas.name,schema:AsignaturaSchema}])],
  controllers: [AsignaturasController],
  providers: [AsignaturasService],
  exports:[AsignaturasService]
})
export class AsignaturasModule {}
