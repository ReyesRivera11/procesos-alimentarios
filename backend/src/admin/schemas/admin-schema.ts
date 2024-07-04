import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Administrador{
    @Prop({required: true,trim: true})
    nombre:string;

    @Prop({required: true,trim: true})
    apellidos:string

    @Prop({required: true,trim: true,unique: true})
    correo:string

    @Prop({required: true,trim: true})
    password:string

};

export const SchemaAdmin = SchemaFactory.createForClass(Administrador);