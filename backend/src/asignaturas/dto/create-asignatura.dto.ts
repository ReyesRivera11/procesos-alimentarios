import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAsignaturaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    @MinLength(5)
    nombre:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(5)
    cuatrimestre:string;
}
