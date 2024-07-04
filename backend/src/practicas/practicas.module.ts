import { Module } from '@nestjs/common';
import { PracticasService } from './practicas.service';
import { PracticasController } from './practicas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Aditivos, AditivosSchema } from 'src/aditivos/schemas/aditivo.schema';
import { MaterialesLab, MaterialesLabSchema } from 'src/material-lab/schemas/material-lab-schema';
import { MaterialesAlmacen, MaterialesAlmacenSchema } from 'src/material-inventario/schema/material-almacen';
import { EquiposLab, SchemaEquiposLab } from 'src/equipos-lab/schema/equipos-lab-schema';
import { EquiposTaller, EquiposTallerSchema } from 'src/equipos-taller/schema/equipos-taller-schema';
import { AsignaturaSchema, Asignaturas } from 'src/asignaturas/schemas/asignatura-schema';
import { Profesores, ProfesoresSchema } from 'src/profesores/schemas/profesores-schema';
import { Practicas, PracticasSchema } from './schema/practicas-schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Aditivos.name, schema: AditivosSchema },
    { name: MaterialesLab.name, schema: MaterialesLabSchema },
    { name: MaterialesAlmacen.name, schema: MaterialesAlmacenSchema },
    { name: EquiposLab.name, schema: SchemaEquiposLab },
    { name: MaterialesAlmacen.name, schema: MaterialesAlmacenSchema },
    { name: Asignaturas.name, schema: AsignaturaSchema },
    { name: Profesores.name, schema: ProfesoresSchema },
    { name: EquiposTaller.name, schema: EquiposTallerSchema },
    { name: Practicas.name, schema: PracticasSchema },
  ])],
  controllers: [PracticasController],
  providers: [PracticasService],
  exports:[MongooseModule]
})
export class PracticasModule {}
