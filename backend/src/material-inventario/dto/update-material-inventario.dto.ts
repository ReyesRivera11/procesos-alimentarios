import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialInventarioDto } from './create-material-inventario.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMaterialInventarioDto extends PartialType(CreateMaterialInventarioDto) {
    @IsString()
    @IsOptional()
    nombre:string;

    @IsNumber()
    @IsOptional()
    existencias:number;

}
