import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class Alumnos{
    @Prop({
        required: true,
        trim: true,
    })
    nombre:string;

    @Prop({
        required: true,
        unique: true,
        trim: true,
    })
    matricula:string;

    @Prop({
     trim: true,   
    })
    password:string;

    @Prop({
        default:true,
    })
    estado:boolean;

    @Prop({
        required: true,
        trim: true,
    })
    cuatrimestre:string;

    @Prop({
        required: true,
        trim: true,
    })
    grupo:string;
};

export const AlumnosSchema = SchemaFactory.createForClass(Alumnos);