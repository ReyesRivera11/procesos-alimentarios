import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialLabDto } from './create-material-lab.dto';
import {  IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateMaterialLabDto extends PartialType(CreateMaterialLabDto) {
    @IsString()
    @IsOptional()
    nombre: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    existencias:number;
}
