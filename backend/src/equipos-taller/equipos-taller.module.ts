import { Module } from '@nestjs/common';
import { EquiposTallerService } from './equipos-taller.service';
import { EquiposTallerController } from './equipos-taller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EquiposTaller, EquiposTallerSchema } from './schema/equipos-taller-schema';

@Module({
  imports:[MongooseModule.forFeature([{name:EquiposTaller.name,schema:EquiposTallerSchema}])],
  controllers: [EquiposTallerController],
  providers: [EquiposTallerService],
})
export class EquiposTallerModule {}
