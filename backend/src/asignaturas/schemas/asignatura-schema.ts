import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class Asignaturas{
    @Prop({
        required: true,
        unique: true,
        trim: true,
    })
    nombre: string;

    @Prop({
        required: true,
        trim: true,
    })
    cuatrimestre: string;
}

export const AsignaturaSchema = SchemaFactory.createForClass(Asignaturas);