import { PartialType } from '@nestjs/mapped-types';
import { CreateAditivoDto } from './create-aditivo.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAditivoDto extends PartialType(CreateAditivoDto) {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsOptional()
    @IsNumber()
    cantidad?: number;
}
