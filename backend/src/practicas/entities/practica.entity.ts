import { Types } from "mongoose";

export class Practica {
    practica: string;
    profesor: Types.ObjectId;
    asignatura: Types.ObjectId;
    cuatrimestre: string;
    grupo: string;
    materiales:object[];
    fecha:string;
    estado:string;
};   
