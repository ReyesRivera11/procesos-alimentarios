import { Module } from '@nestjs/common';
import { MaterialInventarioService } from './material-inventario.service';
import { MaterialInventarioController } from './material-inventario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialesAlmacen, MaterialesAlmacenSchema } from './schema/material-almacen';

@Module({
  imports:[MongooseModule.forFeature([{name:MaterialesAlmacen.name,schema:MaterialesAlmacenSchema}])],
  controllers: [MaterialInventarioController],
  providers: [MaterialInventarioService],
})
export class MaterialInventarioModule {}
