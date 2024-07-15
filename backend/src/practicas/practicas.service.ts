import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePracticaDto } from './dto/create-practica.dto';
import { UpdatePracticaDto } from './dto/update-practica.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MaterialPracticas, Practicas } from './schema/practicas-schema';
import { Model } from 'mongoose';
import { MaterialesAlmacen } from 'src/material-inventario/schema/material-almacen';
import { MaterialesLab } from 'src/material-lab/schemas/material-lab-schema';
import { Aditivos } from 'src/aditivos/schemas/aditivo.schema';
import { EquiposLab } from 'src/equipos-lab/schema/equipos-lab-schema';
import { EquiposTaller } from 'src/equipos-taller/schema/equipos-taller-schema';
import { Aditivo, EquiposLaboratorio, EquiposTallerInterface, MaterialAlmacen, MaterialLab } from 'src/prestamos/interfaces/interfaces';
import { Practica } from './entities/practica.entity';
import { Material } from 'src/prestamos/schema/prestamos-schema';

@Injectable()
export class PracticasService {
  constructor(
    @InjectModel(Practicas.name) private practicasModel: Model<Practicas>,
    @InjectModel(MaterialesAlmacen.name) private materialesAlmacenModel: Model<MaterialAlmacen>,
    @InjectModel(MaterialesLab.name) private materialesLabModel: Model<MaterialLab>,
    @InjectModel(Aditivos.name) private aditivosModel: Model<Aditivo>,
    @InjectModel(EquiposLab.name) private equiposLabModel: Model<EquiposLaboratorio>,
    @InjectModel(EquiposTaller.name) private equiposTallerModel: Model<EquiposTallerInterface>,
  ) { }

  async create(createPracticaDto: CreatePracticaDto) {
    const { materiales } = createPracticaDto;
    const materialesAlmacen = await this.materialesAlmacenModel.find();
    const materialesLab = await this.materialesLabModel.find();
    const aditivos = await this.aditivosModel.find();
    const equiposLab = await this.equiposLabModel.find();
    const equiposTaller = await this.equiposTallerModel.find();
    try {
      materiales.map((material: MaterialPracticas) => {
        equiposTaller.map((equipo) => {
          if (equipo._id.toString() === material._id.toString()) {

            if (equipo.estado === "INACTIVO") {
              throw new ConflictException(`Lo sentimos, en este momento el equipo ${equipo.nombre} se encuentra inactivo.`);
            }

            if (equipo.enUso) {
              throw new ConflictException(`Lo sentimos en este momento el equipo ${equipo.nombre} no esta disponible.`);
            }

          }
        });
        equiposLab.map((equipo) => {
          if (equipo._id.toString() === material._id.toString()) {

            if (equipo.cantidad === 0) {
              throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles en ${equipo.nombre}`);
            }

            if (equipo.cantidad < material.cantidad) {
              throw new ConflictException(`La catidad solicitada para el material ${equipo.nombre} exede el limite.`);
            }

          }
        });
        aditivos.map((aditivo) => {
          if (aditivo._id.toString() === material._id.toString()) {

            if (aditivo.cantidad === 0) {
              throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles en ${aditivo.nombre}`);
            }

            if (aditivo.cantidad < material.cantidad) {
              throw new ConflictException(`La catidad solicitada para el material ${aditivo.nombre} exede el limite.`);
            }

          }
        });

        materialesLab.map(matLab => {
          if (matLab.id.toString() === material._id.toString()) {

            if (matLab.existencias === 0) {
              throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles en ${matLab.nombre}`);
            }

            if (matLab.existencias < material.cantidad) {
              throw new ConflictException(`La catidad solicitada para el material ${matLab.nombre} exede el limite.`);
            }

          }
        });

        materialesAlmacen.map(alm => {
          if (alm.id.toString() === material._id.toString()) {

            if (alm.existencias === 0) {
              throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles en ${alm.nombre}`);
            }

            if (alm.existencias < material.cantidad) {
              throw new ConflictException(`La catidad solicitada para el material ${alm.nombre} exede el limite.`);
            }

          }
        })
      })
      return this.practicasModel.create(createPracticaDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findAll() {
    const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
    const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
    const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
    const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
    const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

    const practicas = await this.practicasModel.find()
      .populate('asignatura', 'nombre')
      .populate('profesor', 'nombre')
      .sort({ createdAt: -1 })
      .lean()
      .exec() as Practica[];

    const practicasConMateriales = practicas.map(practica => {
      const materialesNew = practica.materiales.map((material: MaterialPracticas) => {
        const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
        const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
        const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
        const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
        const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());
        const newMaterial = {
          nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
          disponible:material.disponible,
          cantidad:material.cantidad,
          _id:material._id
        }
        
        return newMaterial
      }).filter(material => material !== undefined);

      return {
        ...practica,
        materiales: materialesNew
      };
    });

    return practicasConMateriales;
  }
  async findPracticasByDocente(id:string) {
    const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
    const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
    const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
    const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
    const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

    const practicas = await this.practicasModel.find({profesor:id})
      .populate('asignatura', 'nombre')
      .populate('profesor', 'nombre')
      .sort({ createdAt: -1 })
      .lean()
      .exec() as Practica[];

    const practicasConMateriales = practicas.map(practica => {
      const materialesNew = practica.materiales.map((material: MaterialPracticas) => {
        const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
        const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
        const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
        const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
        const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());
        const newMaterial = {
          nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
          disponible:material.disponible,
          cantidad:material.cantidad,
          _id:material._id
        }
        
        return newMaterial
      }).filter(material => material !== undefined);

      return {
        ...practica,
        materiales: materialesNew
      };
    });

    return practicasConMateriales;
  }
  async findOne(id: string) {
    const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
    const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
    const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
    const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
    const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

    const practicas = await this.practicasModel.find({ _id: id })
      .populate('asignatura', 'nombre')
      .populate('profesor', 'nombre')
      .sort({ createdAt: -1 })
      .lean()
      .exec() as Practica[];

    const practicasConMateriales = practicas.map(practica => {
      const materialesNew = practica.materiales.map((material: MaterialPracticas) => {
        const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
        const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
        const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
        const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
        const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());

        const newMaterial = {
          nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
          disponible:material.disponible,
          cantidad:material.cantidad,
          _id:material._id
        }
        
        return newMaterial
      }).filter(material => material !== undefined);

      return {
        ...practica,
        materiales: materialesNew
      };
    });

    return practicasConMateriales;
  }

  async findAvailable({ cuatrimestre, grupo }: { cuatrimestre: string; grupo: string }) {
    const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
    const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
    const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
    const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
    const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

    const practicas = await this.practicasModel.find({ cuatrimestre: cuatrimestre, grupo: grupo,estado:"ACTIVO" })
      .populate('asignatura', 'nombre')
      .populate('profesor', 'nombre')
      .sort({ createdAt: -1 })
      .lean()
      .exec() as Practica[];

    const practicasConMateriales = practicas.map(practica => {
      const materialesNew = practica.materiales.map((material: MaterialPracticas) => {
        const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
        const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
        const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
        const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
        const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());

        const newMaterial = {
          nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
          disponible:material.disponible,
          _id:material._id
        }
        
        return newMaterial
      }).filter(material => material !== undefined);

      return {
        ...practica,
        materiales: materialesNew
      };
    });

    return practicasConMateriales;
  }


  update(id: string, updatePracticaDto: UpdatePracticaDto) {
    return this.practicasModel.findByIdAndUpdate(id, updatePracticaDto);
  }

  remove(id: string) {
    return this.practicasModel.findByIdAndDelete(id);
  }
}
