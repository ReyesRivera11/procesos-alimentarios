import { Module } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { PracticasController } from './prestamos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Prestamos, PrestamosSchema } from './schema/prestamos-schema';
import { Aditivos, AditivosSchema } from 'src/aditivos/schemas/aditivo.schema';
import { MaterialesLab, MaterialesLabSchema } from 'src/material-lab/schemas/material-lab-schema';
import { MaterialesAlmacenSchema,MaterialesAlmacen } from 'src/material-inventario/schema/material-almacen';
import { EquiposLab, SchemaEquiposLab } from 'src/equipos-lab/schema/equipos-lab-schema';
import { EquiposTaller, EquiposTallerSchema } from 'src/equipos-taller/schema/equipos-taller-schema';
import { Practicas, PracticasSchema } from 'src/practicas/schema/practicas-schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Prestamos.name, schema: PrestamosSchema },
    { name: Aditivos.name, schema: AditivosSchema },
    { name: MaterialesLab.name, schema: MaterialesLabSchema },
    { name: MaterialesAlmacen.name, schema: MaterialesAlmacenSchema },
    { name: EquiposLab.name, schema: SchemaEquiposLab },
    { name: EquiposTaller.name, schema: EquiposTallerSchema },
    { name: Practicas.name, schema: PracticasSchema },
  ]
  )],
  controllers: [PracticasController],
  providers: [PrestamosService],
})
export class PrestamosModule { }
