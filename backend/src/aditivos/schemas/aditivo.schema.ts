import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class Aditivos{
    @Prop({
        unique: true,
        required: true,
        trim: true,
    })
    nombre: string;

    @Prop({
        required: true,
    })
    cantidad: number;
};

export const AditivosSchema = SchemaFactory.createForClass(Aditivos)