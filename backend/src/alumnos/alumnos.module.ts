import { Module } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Alumnos, AlumnosSchema } from './schemas/alumno-schema';
import { AuthModule } from 'src/auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { AdminModule } from 'src/admin/admin.module';
import { AdminController } from 'src/admin/admin.controller';
import { AdminService } from 'src/admin/admin.service';
import { ProfesoresModule } from 'src/profesores/profesores.module';
import { ProfesoresController } from 'src/profesores/profesores.controller';
import { ProfesoresService } from 'src/profesores/profesores.service';

@Module({
  imports: [AuthModule, AdminModule, ProfesoresModule, MongooseModule.forFeature([{ name: Alumnos.name, schema: AlumnosSchema }])],
  controllers: [AlumnosController, ProfesoresController, AuthController, AdminController],
  providers: [AlumnosService, AuthService, AdminService, ProfesoresService],
  exports: [MongooseModule]
})
export class AlumnosModule { }
