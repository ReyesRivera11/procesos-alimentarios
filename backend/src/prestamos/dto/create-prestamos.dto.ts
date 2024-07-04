import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

class MaterialDto {
    @IsNotEmpty()
    @IsString()
    _id:String;

    @IsNotEmpty()
    @IsNumber()
    cantidad:number;
}


export class CreatePrestamosDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(60)
    asignatura:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(60)
    profesor: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(60)
    alumno: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(60)
    nombrePractica:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    fecha:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(8)
    horaEntregaSolicitud:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    fechaMaterialRequerido:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(8)
    horaMaterialRequerido:string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>MaterialDto)
    materiales:MaterialDto[];

    @IsOptional()
    @IsBoolean()
    aceptado: boolean;

    @IsOptional()
    @IsBoolean()
    devuelto:boolean;

    @IsOptional()
    @IsBoolean()
    entregado:boolean;

    @IsString()
    @IsNotEmpty()
    id_Practica:string;
}
