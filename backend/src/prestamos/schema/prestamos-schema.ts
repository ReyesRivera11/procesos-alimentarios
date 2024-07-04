import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { Alumnos } from "src/alumnos/schemas/alumno-schema";
import { Asignaturas } from "src/asignaturas/schemas/asignatura-schema";
import { Profesores } from "src/profesores/schemas/profesores-schema";

export interface Material {
    _id:string;
    cantidad:number;
}


@Schema({
    timestamps: true,
})
export class Prestamos {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: Asignaturas.name,
    })
    asignatura: Types.ObjectId;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: Profesores.name,
    })
    profesor: Types.ObjectId;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: Alumnos.name,
    })
    alumno: Types.ObjectId;

    @Prop({
        required: true,
        trim: true,
    })
    nombrePractica: string;

    @Prop({
        trim: true,
    })
    fecha: string;

    @Prop({
        required: true,
        trim: true,
    })
    horaEntregaSolicitud: string;

    @Prop({
        required: true,
        trim: true,
    })
    fechaMaterialRequerido: string;

    @Prop({
        required: true,
        trim: true,
    })
    horaMaterialRequerido: string;

    @Prop({
        required: true,
    })
    materiales: Material[];
    
    @Prop()
    aceptado: boolean;

    @Prop({
        default: false
    })
    devuelto: boolean;

    @Prop({
        default: false
    })
    entregado:boolean;
}

export const PrestamosSchema = SchemaFactory.createForClass(Prestamos);

