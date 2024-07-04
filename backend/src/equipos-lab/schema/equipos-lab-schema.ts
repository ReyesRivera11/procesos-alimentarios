import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class EquiposLab {
    @Prop({
        required: true,
        unique: true,
        trim: true
    })
    nombre: string;


    @Prop({
        required: true,
    })
    cantidad: number;
}

export const SchemaEquiposLab = SchemaFactory.createForClass(EquiposLab);