import { PartialType } from '@nestjs/mapped-types';
import { CreatePracticaDto } from './create-practica.dto';
import { IsOptional, IsNumber, IsString, Max, MaxLength, Min, MinLength, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

class MaterialDto {
    @IsOptional()
    @IsString()
    _id:String;

    @IsOptional()
    @IsNumber()
    @Max(100)
    cantidad:number;
}

export class UpdatePracticaDto extends PartialType(CreatePracticaDto) {
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(30)
    practica: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(30)
    profesor:string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(30)
    asignatura:string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    cuatrimestre:string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(3)
    grupo:string;

    @IsOptional()
    @IsString()
    fecha:string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>MaterialDto)
    materiales:MaterialDto[];

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(15)
    estado:string;
}


