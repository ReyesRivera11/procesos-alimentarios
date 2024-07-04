import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateEquiposTallerDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(40)
    nombre: string;

   @IsBoolean()
   @IsNotEmpty()
    enUso: boolean;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    estado: string;
}
