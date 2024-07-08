import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Asignaturas } from "src/asignaturas/schemas/asignatura-schema";
import { Profesores } from "src/profesores/schemas/profesores-schema";

export interface MaterialPracticas {
    _id:string;
    cantidad:number;
    disponible:number;
}

@Schema({
    timestamps: true,
})
export class Practicas {

    @Prop({
        required: true,
        trim: true,
    })
    practica: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: Profesores.name,
    })
    profesor: Types.ObjectId;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: Asignaturas.name,
    })
    asignatura: Types.ObjectId;
    
    @Prop({
        trim: true,
        required: true,
    })
    cuatrimestre: string;

    @Prop({
        trim: true,
        required: true
    })
    grupo: string;

    @Prop({
        required: true,
    })
    fecha: string;


    @Prop({
        required: true,
    })
    materiales: MaterialPracticas[];
    
    @Prop({
        required: true,
        default: "ACTIVO",
    })
    estado: string;
   
}

export const PracticasSchema = SchemaFactory.createForClass(Practicas);

