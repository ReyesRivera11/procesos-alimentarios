import { Types } from "mongoose";

export class Practica {
    practica: string;
    profesor: Types.ObjectId;
    asignatura: Types.ObjectId;
    semestre: string;
    grupo: string;
    materiales:object[];
    fecha:string;
    estado:string;
};   
