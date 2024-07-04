import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    nombre:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(80)
    apellidos:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(50)
    correo:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    password:string;

    @IsString()
    role:string;
}
