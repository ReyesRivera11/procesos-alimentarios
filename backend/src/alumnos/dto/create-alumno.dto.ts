import { IsBoolean, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateAlumnoDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(80)
    nombre:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(8)
    @MinLength(8)
    matricula:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    @MinLength(8)
    password:string;

    @IsOptional()
    @IsBoolean()
    estado:boolean;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    cuatrimestre:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1)
    @MinLength(1)
    grupo:string;
}
