import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps:true
})


export class MaterialesAlmacen{
    @Prop({
        required: true,
        unique: true,
        trim: true
    })
    nombre:string;

    @Prop({
        required: true,
    })
    existencias:number;
};

export const MaterialesAlmacenSchema = SchemaFactory.createForClass(MaterialesAlmacen);