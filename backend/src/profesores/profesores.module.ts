import { Module } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profesores, ProfesoresSchema } from './schemas/profesores-schema';
import { AsignaturaSchema, Asignaturas } from 'src/asignaturas/schemas/asignatura-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profesores.name, schema: ProfesoresSchema }]),
    MongooseModule.forFeature([{ name: Asignaturas.name, schema: AsignaturaSchema }]),
],
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
  exports:[MongooseModule]
})
export class ProfesoresModule {}
