import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesoreDto } from './create-profesore.dto';
import { IsMongoId, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import mongoose, { Types } from 'mongoose';
export class UpdateProfesoreDto extends PartialType(CreateProfesoreDto) {
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    @IsOptional()
    nombre: string;

    @IsString()
    @MinLength(3)
    @MaxLength(40)
    @IsOptional()
    correo: string;

    @IsString()
    @MinLength(3)
    @MaxLength(40)
    @IsOptional()
    password: string;

    @IsOptional()
    @IsMongoId({each:true})
    materias:Types.ObjectId[];
}


export class ChangePasswordDto extends PartialType(CreateProfesoreDto){
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    actualPassword: string;
}
