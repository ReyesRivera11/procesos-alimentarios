import { Module } from '@nestjs/common';
import { AditivosService } from './aditivos.service';
import { AditivosController } from './aditivos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Aditivos, AditivosSchema } from './schemas/aditivo.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Aditivos.name,schema:AditivosSchema}])
  ],
  controllers: [AditivosController],
  providers: [AditivosService],
})
export class AditivosModule {}
