import { PartialType } from '@nestjs/mapped-types';
import { CreateAlumnoDto } from './create-alumno.dto';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAlumnoDto extends PartialType(CreateAlumnoDto) {
    @IsString()
    @IsOptional()
    nombre:string;

    @IsString()
    @IsOptional()
    matricula:string;

    @IsBoolean()
    @IsOptional()
    estado:boolean;

    @IsString()
    @IsOptional()
    cuatrimestre:string;

    @IsString()
    @IsOptional()
    grupo:string;
}

export class ChangePasswordDto extends PartialType(CreateAlumnoDto){
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    actualPassword: string;
}