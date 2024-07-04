import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsString()
    @IsOptional()
    nombre:string;

    @IsString()
    @IsOptional()
    apellidos:string;

    @IsString()
    @IsOptional()
    correo:string;

    @IsString()
    @IsOptional()
    password:string;

    @IsString()
    @IsOptional()
    role: string;
}
