import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Administrador, SchemaAdmin } from './schemas/admin-schema';
import { AuthModule } from 'src/auth/auth.module';
import { AlumnosModule } from 'src/alumnos/alumnos.module';
import { AuthController } from 'src/auth/auth.controller';
import { AlumnosController } from 'src/alumnos/alumnos.controller';
import { AuthService } from 'src/auth/auth.service';
import { AlumnosService } from 'src/alumnos/alumnos.service';

@Module({
  imports:[MongooseModule.forFeature([{name:Administrador.name,schema:SchemaAdmin}])],
  controllers: [AdminController],
  providers: [AdminService],
  exports:[MongooseModule]
})
export class AdminModule {}
