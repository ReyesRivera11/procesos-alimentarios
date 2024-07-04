import { PartialType } from '@nestjs/mapped-types';
import { CreatePrestamosDto } from './create-prestamos.dto';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class MaterialDto {
    @IsNotEmpty()
    @IsString()
    _id:String;

    @IsNotEmpty()
    @IsNumber()
    cantidad:number;
}

export class UpdatePracticaDto extends PartialType(CreatePrestamosDto) {
    @IsString()
    @IsOptional()
    asignatura: string;

    @IsString()
    @IsOptional()
    profesor: string;

    @IsString()
    @IsOptional()
    alumno: string;

    @IsString()
    @IsOptional()
    nombrePractica: string;

    @IsOptional()
    @IsString()
    fecha:string;

    @IsString()
    @IsOptional()
    horaEntregaSolicitud: string;

    @IsString()
    @IsOptional()
    fechaMaterialRequerido: string;

    @IsString()
    @IsOptional()
    horaMaterialRequerido: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>MaterialDto)
    materiales:MaterialDto[];
    
    @IsOptional()
    @IsBoolean()
    devuelto:boolean;

    @IsOptional()
    @IsBoolean()
    entregado:boolean;

    @IsOptional()
    @IsString()
    id_Practica?: string;
}
export class AcceptRequest{
    @IsNotEmpty()
    @IsBoolean()
    aceptado: boolean;

    @IsNotEmpty()
    @IsString()
    id:string;
};

export class ConfirmDeliver{
    @IsNotEmpty()
    @IsBoolean()
    entregado: boolean;

    @IsNotEmpty()
    @IsString()
    id:string;
};

export class ConfirmReturn {
    @IsNotEmpty()
    @IsBoolean()
    devuelto: boolean;

    @IsNotEmpty()
    @IsString()
    id:string;
};

