import { PartialType } from '@nestjs/mapped-types';
import { CreateEquiposTallerDto } from './create-equipos-taller.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateEquiposTallerDto extends PartialType(CreateEquiposTallerDto) {
    @IsString()
    @IsOptional()
    nombre: string;

    @IsBoolean()
    @IsOptional()
    enUso: boolean;

    @IsString()
    @IsOptional()
    estado: string;
}
