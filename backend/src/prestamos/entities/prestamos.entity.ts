import { Types } from "mongoose";

export class PrestamosEntity {
    asignatura: Types.ObjectId;
    profesor: Types.ObjectId;
    alumno: Types.ObjectId;
    nombrePractica:string;
    fecha:string;
    horaEntregaSolicitud:string;
    fechaMaterialRequerido:string;
    horaMaterialRequerido:string;
    materiales:object[];
    aceptado?: boolean;
    devuelto:boolean;   
    entregado:boolean;
};
