import { PartialType } from '@nestjs/mapped-types';
import { CreateAsignaturaDto } from './create-asignatura.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAsignaturaDto extends PartialType(CreateAsignaturaDto) {
    @IsOptional()
    @IsString()
    nombre: string;
    
    @IsOptional()
    @IsString()
    cuatrimestre: string;
}
