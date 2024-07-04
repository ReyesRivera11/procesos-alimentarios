import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateAditivoDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    cantidad:number;
}
