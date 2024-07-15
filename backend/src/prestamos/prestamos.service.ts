import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrestamosDto } from './dto/create-prestamos.dto';
import { AcceptRequest, ConfirmDeliver, ConfirmReturn, UpdatePracticaDto } from './dto/update-prestamos.dto';
import { Prestamos, Material } from './schema/prestamos-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaterialesLab } from 'src/material-lab/schemas/material-lab-schema';
import { MaterialesAlmacen } from 'src/material-inventario/schema/material-almacen';
import { Aditivos } from 'src/aditivos/schemas/aditivo.schema';
import { PrestamosEntity } from './entities/prestamos.entity';
import { MaterialAlmacen, Aditivo, MaterialLab, EquiposLaboratorio, EquiposTallerInterface } from './interfaces/interfaces';
import { EquiposLab } from 'src/equipos-lab/schema/equipos-lab-schema';
import { EquiposTaller } from 'src/equipos-taller/schema/equipos-taller-schema';
import { MaterialPracticas, Practicas } from 'src/practicas/schema/practicas-schema';
@Injectable()
export class PrestamosService {
  constructor(
    @InjectModel(Prestamos.name) private prestamosModel: Model<Prestamos>,
    @InjectModel(MaterialesAlmacen.name) private materialesAlmacenModel: Model<MaterialAlmacen>,
    @InjectModel(MaterialesLab.name) private materialesLabModel: Model<MaterialLab>,
    @InjectModel(Aditivos.name) private aditivosModel: Model<Aditivo>,
    @InjectModel(EquiposLab.name) private equiposLabModel: Model<EquiposLaboratorio>,
    @InjectModel(EquiposTaller.name) private equiposTallerModel: Model<EquiposTallerInterface>,
    @InjectModel(Practicas.name) private practicasModel: Model<Practicas>,
  ) { }

  async create(createPrestamosDto: CreatePrestamosDto): Promise<Prestamos> {
    const { materiales } = createPrestamosDto;
    const practica = await this.practicasModel.findOne({ _id: createPrestamosDto.id_Practica, estado: "ACTIVO" });
    const materialesAlmacen = await this.materialesAlmacenModel.find();
    const materialesLab = await this.materialesLabModel.find();
    const aditivos = await this.aditivosModel.find();
    const equiposLab = await this.equiposLabModel.find();
    const equiposTaller = await this.equiposTallerModel.find();
    if (!practica) {
      throw new NotFoundException('Práctica no encontrada');
    }

    try {
      for (const materialRequerido of materiales) {
        let encontrado = false;

        for (const material of practica.materiales) {
          if (materialRequerido._id === material._id) {
            encontrado = true;
            break;
          }
        }

        if (!encontrado) {
          const aditivo = await this.aditivosModel.findById(materialRequerido._id);
          const equipoLab = !aditivo && await this.equiposLabModel.findById(materialRequerido._id);
          const equipoTaller = !aditivo && !equipoLab && await this.equiposTallerModel.findById(materialRequerido._id);
          const materialAlmacen = !aditivo && !equipoLab && !equipoTaller && await this.materialesAlmacenModel.findById(materialRequerido._id);
          const materialLab = !aditivo && !equipoLab && !equipoTaller && !materialAlmacen && await this.materialesLabModel.findById(materialRequerido._id);

          const entity = aditivo || equipoLab || equipoTaller || materialAlmacen || materialLab;

          throw new NotFoundException(`El material ${entity?.nombre || materialRequerido._id} no se encuentra requerido para esta práctica.`);
        }
      }

      for (const material of materiales) {
        const aditivo = await this.aditivosModel.findById(material._id);
        const equipoLab = !aditivo && await this.equiposLabModel.findById(material._id);
        const equipoTaller = !aditivo && !equipoLab && await this.equiposTallerModel.findById(material._id);
        const materialAlmacen = !aditivo && !equipoLab && !equipoTaller && await this.materialesAlmacenModel.findById(material._id);
        const materialLab = !aditivo && !equipoLab && !equipoTaller && !materialAlmacen && await this.materialesLabModel.findById(material._id);

        const entity = aditivo || equipoLab || equipoTaller || materialAlmacen || materialLab;

        if (!entity) {
          throw new NotFoundException(`El material ${material._id} no se encuentra en el sistema.`);
        }


        practica.materiales.map((materialPractica: MaterialPracticas) => {
          if (material._id === materialPractica._id) {
            if (materialPractica.disponible === 0) {
              throw new ConflictException(`Lo sentimos no contamos con unidades disponibles en ${entity.nombre}`)
            }
            if (materialPractica.disponible < material.cantidad) {
              throw new ConflictException(`Lo sentimos la cantidad solicitada en ${entity.nombre} exede el limite solicitado por el docente.`);
            }
          }
        })


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
          const materialPractica = practica.materiales.find((materialPrac: MaterialPracticas) => material._id === materialPrac._id);
          if (materialPractica) {
            materialPractica.disponible -= material.cantidad;
          }

        })

      }
      practica.markModified('materiales');
      await practica.save();
      return this.prestamosModel.create(createPrestamosDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async acceptRequest(acceptData: AcceptRequest): Promise<Prestamos> {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find();
      const materialesLab = await this.materialesLabModel.find();
      const aditivos = await this.aditivosModel.find();
      const prestamo = await this.prestamosModel.findById(acceptData.id);
      const equiposLab = await this.equiposLabModel.find();
      const equiposTaller = await this.equiposTallerModel.find();
      if (!prestamo) throw new NotFoundException("El prestamo no fue encontrado.");

      if (acceptData.aceptado) {
        prestamo.materiales.map((material: Material) => {
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
                throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles de ${equipo.nombre}`);
              }

              if (equipo.cantidad < material.cantidad) {
                throw new ConflictException(`La cantidad es mayor a las existencias de ${equipo.nombre}`);
              }
            }
          });
          aditivos.map((aditivo) => {
            if (aditivo._id.toString() === material._id.toString()) {
              if (aditivo.cantidad === 0) {
                throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles de ${aditivo.nombre}`);
              }

              if (aditivo.cantidad < material.cantidad) {
                throw new ConflictException(`La cantidad es mayor a las existencias de ${aditivo.nombre}`);
              }
            }
          });

          materialesLab.map(matLab => {
            if (matLab.id.toString() === material._id.toString()) {
              if (matLab.existencias >= material.cantidad) {
                if (matLab.existencias === 0) {
                  throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles en ${matLab.nombre}`);
                }

                if (matLab.existencias < material.cantidad) {
                  throw new ConflictException(`La cantidad es mayor a las existencias en ${matLab.nombre}`);
                }
              }
            }
          });

          materialesAlmacen.map(alm => {
            if (alm.id.toString() === material._id.toString()) {
              if (alm.existencias >= material.cantidad) {
                if (alm.existencias === 0) {
                  throw new ConflictException(`Lo sentimos, en este momento no contamos con unidades disponibles en ${alm.nombre}`);
                }

                if (alm.existencias < material.cantidad) {
                  throw new ConflictException(`La cantidad es mayor a las existencias en ${alm.nombre}}`);
                }
              }
            }
          })
        });
        prestamo.materiales.map((material: Material) => {
          equiposTaller.map((equipo) => {
            if (equipo._id.toString() === material._id.toString()) {
              if (!equipo.enUso) {
                console.log("hOLA")
                const updatedQuantity = async () => {
                  await this.equiposTallerModel.findByIdAndUpdate(material._id, {
                    enUso: true,
                  });
                };
                updatedQuantity();
              }
            }
          });
          equiposLab.map((equipo) => {
            if (equipo._id.toString() === material._id.toString()) {
              if (equipo.cantidad >= material.cantidad) {
                const newQuantity = equipo.cantidad - material.cantidad;
                const updatedQuantity = async () => {
                  await this.equiposLabModel.findByIdAndUpdate(material._id, {
                    cantidad: newQuantity,
                  });
                }
                updatedQuantity();
              }
            }
          });
          aditivos.map((aditivo) => {
            if (aditivo._id.toString() === material._id.toString()) {
              if (aditivo.cantidad >= material.cantidad) {
                const newQuantity = aditivo.cantidad - material.cantidad;
                const updatedQuantity = async () => {
                  await this.aditivosModel.findByIdAndUpdate(material._id, {
                    cantidad: newQuantity
                  });
                }
                updatedQuantity();
              }
            }
          });

          materialesLab.map(matLab => {
            if (matLab.id.toString() === material._id.toString()) {
              if (matLab.existencias >= material.cantidad) {
                const newQuantity = matLab.existencias - material.cantidad;
                const updatedQuantity = async () => {
                  await this.materialesLabModel.findByIdAndUpdate(material._id, { existencias: newQuantity });
                }
                updatedQuantity();
              }
            }
          });

          materialesAlmacen.map(alm => {
            if (alm.id.toString() === material._id.toString()) {
              if (alm.existencias >= material.cantidad) {
                const newQuantity = alm.existencias - material.cantidad;
                const updatedQuantity = async () => {
                  await this.materialesAlmacenModel.findByIdAndUpdate(material._id, { existencias: newQuantity });
                }
                updatedQuantity();
              }
            }
          })
        });
      };

      const prestamoWithField = await this.prestamosModel.find({
        _id: acceptData.id,
        aceptado: { $exists: true }
      });

      if (prestamoWithField) {
        const res = await this.prestamosModel.findByIdAndUpdate(acceptData.id, { aceptado: acceptData.aceptado }, { new: true })
        return res;
      }

      const res = await this.prestamosModel.findByIdAndUpdate(acceptData.id, { $set: { aceptado: acceptData.aceptado } }, { new: true });

      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Error interno en el servidor", HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async confirmDeliver(confirmData: ConfirmDeliver) {
    return await this.prestamosModel.findByIdAndUpdate(confirmData.id, { entregado: confirmData.entregado }, { new: true });
  }

  async confirmReturn(confirmData: ConfirmReturn) {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find();
      const materialesLab = await this.materialesLabModel.find();
      const aditivos = await this.aditivosModel.find();
      const equiposLab = await this.equiposLabModel.find();
      const equiposTaller = await this.equiposTallerModel.find();
      const prestamo = await this.prestamosModel.findById(confirmData.id);

      if (!prestamo) throw new NotFoundException("El prestamo no fue encontrado.");

      if (confirmData.devuelto) {
        prestamo.materiales.map((material: Material) => {
          equiposTaller.map((equipo) => {
            if (equipo._id.toString() === material._id.toString()) {
              const updatedQuantity = async () => {
                await this.equiposTallerModel.findByIdAndUpdate(material._id, {
                  enUso: false,
                });
              }
              updatedQuantity();
            }
          });
          equiposLab.map((equipo) => {
            if (equipo._id.toString() === material._id.toString()) {
              const newQuantity = equipo.cantidad + material.cantidad;
              const updatedQuantity = async () => {
                await this.equiposLabModel.findByIdAndUpdate(material._id, {
                  cantidad: newQuantity
                });
              }
              updatedQuantity();
            }
          });
          aditivos.map((aditivo) => {
            if (aditivo._id.toString() === material._id.toString()) {
              const newQuantity = aditivo.cantidad + material.cantidad;
              const updatedQuantity = async () => {
                await this.aditivosModel.findByIdAndUpdate(material._id, {
                  cantidad: newQuantity
                });
              }
              updatedQuantity();
            }
          });

          materialesLab.map(matLab => {
            if (matLab.id.toString() === material._id.toString()) {
              const newQuantity = matLab.existencias + material.cantidad;
              const updatedQuantity = async () => {
                await this.materialesLabModel.findByIdAndUpdate(material._id, { existencias: newQuantity });
              }
              updatedQuantity();
            }
          });

          materialesAlmacen.map(alm => {
            if (alm.id.toString() === material._id.toString()) {
              const newQuantity = alm.existencias + material.cantidad;
              const updatedQuantity = async () => {
                await this.materialesAlmacenModel.findByIdAndUpdate(material._id, { existencias: newQuantity });
              }
              updatedQuantity();
            }
          })
        });
      }
      return await this.prestamosModel.findByIdAndUpdate(confirmData.id, { devuelto: confirmData.devuelto }, { new: true });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException("Error interno en el servidor", HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async getNotReturn() {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
      const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
      const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
      const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
      const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

      const practicas = await this.prestamosModel.find({ devuelto: false, aceptado: true, entregado: true })
        .populate('asignatura', 'nombre')
        .populate('profesor', 'nombre')
        .populate('alumno', 'nombre')
        .sort({ createdAt: -1 })
        .lean()
        .exec() as PrestamosEntity[];

      const practicasConMateriales = practicas.map(practica => {
        const materialesNew = practica.materiales.map((material: Material) => {
          const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
          const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
          const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
          const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
          const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());
          const newMaterial = {
            nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
            cantidad: material.cantidad
          };


          return newMaterial;

        }).filter(material => material !== undefined);

        return {
          ...practica,
          materiales: materialesNew
        };
      });

      return practicasConMateriales;
    } catch (error) {
      console.error('Error al buscar prácticas:', error);
      throw error;
    }
  }

  async getNotDeliveries() {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
      const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
      const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
      const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
      const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

      const practicas = await this.prestamosModel.find({ entregado: false, aceptado: true })
        .populate('asignatura', 'nombre')
        .populate('profesor', 'nombre')
        .populate('alumno', 'nombre')
        .sort({ createdAt: -1 })
        .lean()
        .exec() as PrestamosEntity[];

      const practicasConMateriales = practicas.map(practica => {
        const materialesNew = practica.materiales.map((material: Material) => {
          const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
          const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
          const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
          const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
          const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());
          const newMaterial = {
            nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
            cantidad: material.cantidad
          };


          return newMaterial;

        }).filter(material => material !== undefined);

        return {
          ...practica,
          materiales: materialesNew
        };
      });

      return practicasConMateriales;
    } catch (error) {
      console.error('Error al buscar prácticas:', error);
      throw error;
    }
  }

  async getRequests() {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
      const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
      const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
      const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
      const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

      const practicas = await this.prestamosModel.find({ aceptado: { $exists: false } })
        .populate('asignatura', 'nombre')
        .populate('profesor', 'nombre')
        .populate('alumno', 'nombre')
        .sort({ createdAt: -1 })
        .lean()
        .exec() as PrestamosEntity[];

      const practicasConMateriales = practicas.map(practica => {
        const materialesNew = practica.materiales.map((material: Material) => {
          const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
          const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
          const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
          const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
          const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());
          const newMaterial = {
            nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
            cantidad: material.cantidad
          };


          return newMaterial;

        }).filter(material => material !== undefined);

        return {
          ...practica,
          materiales: materialesNew
        };
      });

      return practicasConMateriales;
    } catch (error) {
      console.error('Error al buscar prácticas:', error);
      throw error;
    }
  }

  async getRejectedRequests() {
    return await this.prestamosModel.find({ aceptado: false });
  }


  async findAll() {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
      const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
      const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
      const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
      const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

      const practicas = await this.prestamosModel.find()
        .populate('asignatura', 'nombre')
        .populate('profesor', 'nombre')
        .populate('alumno', 'nombre')
        .sort({ createdAt: -1 })
        .lean()
        .exec() as PrestamosEntity[];

      const practicasConMateriales = practicas.map(practica => {
        const materialesNew = practica.materiales.map((material: Material) => {
          const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
          const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
          const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
          const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
          const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());

          const newMaterial = {
            nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
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
    } catch (error) {
      console.error('Error al buscar prácticas:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find();
      const materialesLab = await this.materialesLabModel.find();
      const aditivos = await this.aditivosModel.find();
      const equiposLab = await this.equiposLabModel.find();
      const equiposTaller = await this.equiposTallerModel.find();

      const practicas = await this.prestamosModel.findById(id)
        .populate('asignatura', 'nombre')
        .populate('profesor', 'nombre')
        .populate('alumno', 'nombre cuatrimestre grupo')
        .lean()
        .exec() as PrestamosEntity;

      const materialesNew = practicas.materiales.map((material: Material) => {
        const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
        const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
        const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
        const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
        const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());

        const newMaterial = {
          nombre: materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
          cantidad: material.cantidad
        };


        return newMaterial;
      }).filter(material => material !== undefined);


      return { ...practicas, materiales: materialesNew };
    } catch (error) {
      console.error('Error al buscar prácticas:', error);
      throw error;
    }
  }

  async findByAlumno(id:string) {
    try {
      const materialesAlmacen = await this.materialesAlmacenModel.find().lean().exec() as MaterialAlmacen[];
      const materialesLab = await this.materialesLabModel.find().lean().exec() as MaterialLab[];
      const aditivos = await this.aditivosModel.find().lean().exec() as Aditivo[];
      const equiposLab = await this.equiposLabModel.find().lean().exec() as EquiposLaboratorio[];
      const equiposTaller = await this.equiposTallerModel.find().lean().exec() as EquiposTallerInterface[];

      const practicas = await this.prestamosModel.find({alumno:id})
        .populate('asignatura', 'nombre')
        .populate('profesor', 'nombre')
        .populate('alumno', 'nombre')
        .sort({ createdAt: -1 })
        .lean()
        .exec() as PrestamosEntity[];

      const practicasConMateriales = practicas.map(practica => {
        const materialesNew = practica.materiales.map((material: Material) => {
          const materialAlmacen = materialesAlmacen.find(mat => mat._id.toString() === material._id.toString());
          const materialLab = materialesLab.find(mat => mat._id.toString() === material._id.toString());
          const aditivo = aditivos.find(mat => mat._id.toString() === material._id.toString());
          const equipoLab = equiposLab.find(mat => mat._id.toString() === material._id.toString());
          const equipoTaller = equiposTaller.find(mat => mat._id.toString() === material._id.toString());
          const newData = {
            _id: materialAlmacen?._id || materialLab?._id || aditivo?._id || equipoLab?._id || equipoTaller?._id,
            nombre:materialAlmacen?.nombre || materialLab?.nombre || aditivo?.nombre || equipoLab?.nombre || equipoTaller?.nombre,
            cantidad:material.cantidad
          }
          return  newData;
        }).filter(material => material !== undefined);

        return {
          ...practica,
          materiales: materialesNew
        };
      });

      return practicasConMateriales;
    } catch (error) {
      console.error('Error al buscar prácticas:', error);
      throw error;
    }
  }


  async update(id: string, updatePracticaDto: UpdatePracticaDto) {
    const res = await this.prestamosModel.findByIdAndUpdate(id, updatePracticaDto, { new: true });
    return res;
  }

  remove(id: string) {
    return this.prestamosModel.findByIdAndDelete(id);
  }


}
