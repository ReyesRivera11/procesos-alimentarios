import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Asignaturas } from "src/asignaturas/schemas/asignatura-schema";

@Schema({
    timestamps: true,
}) 
export class Profesores {
    @Prop({
        required: true,
        trim: true,
    })
    nombre: string;
    @Prop({
        required: true,
        trim: true,
        unique: true,
    })
    correo: string;
    @Prop({
        required: true,
        trim: true,
        unique: true
    })
    password: string;
    @Prop({
        type: [{ type: Types.ObjectId, ref: Asignaturas.name }],
        required: true,
    })
    materias:Types.ObjectId[];
}

export const ProfesoresSchema = SchemaFactory.createForClass(Profesores);