import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AsignaturasModule } from './asignaturas/asignaturas.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { MaterialLabModule } from './material-lab/material-lab.module';
import { MaterialInventarioModule } from './material-inventario/material-inventario.module';
import { AditivosModule } from './aditivos/aditivos.module';
import { EquiposTallerModule } from './equipos-taller/equipos-taller.module';
import { EquiposLabModule } from './equipos-lab/equipos-lab.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PracticasModule } from './practicas/practicas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI|| "mongodb+srv://procesosalimentarios110:procesosalimentarios110@cluster0.fzgzcvx.mongodb.net/procesos?retryWrites=true&w=majority&appName=Cluster0"), AsignaturasModule, ProfesoresModule, AlumnosModule, MaterialLabModule, MaterialInventarioModule, AditivosModule, EquiposTallerModule, EquiposLabModule, PrestamosModule, AuthModule, AdminModule,PracticasModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
