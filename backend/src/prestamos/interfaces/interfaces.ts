export interface MaterialAlmacen {
    _id: string;
    nombre: string;
    existencias:number;
    createdAt:Date;
    updatedAt:Date;
    // otras propiedades...
  }

  export interface EquiposLaboratorio {
    _id: string;
    nombre: string;
    cantidad:number;
  }
  export interface EquiposTallerInterface {
    _id: string;
    nombre: string;
    cantidad:number;
    estado:string;
    enUso:boolean;
  }
  
 export interface MaterialLab {
    _id: string;
    nombre: string;
    existencias:number;
    createdAt:Date;
    updatedAt:Date;

    // otras propiedades...
  }
  
export interface Aditivo {
    _id: string;
    nombre: string;
    cantidad:number;
    createdAt:Date;
    updatedAt:Date;
    // otras propiedades...
  }
  
 export interface Practica {
    _id: string;
    materiales: string[];
    asignatura: string;
    profesor: string;
    alumno: string;
    nombrePractica:string;
    fecha:string;
    horaEntregaSolicitud:string;
    fechaMaterialRequerido:string;
    horaMaterialRequerido:string;
    aceptado?: boolean;
    entregado:boolean;
    devuelto:boolean;
    createdAt:Date;
    updatedAt:Date;
    // otras propiedades...
  }
  