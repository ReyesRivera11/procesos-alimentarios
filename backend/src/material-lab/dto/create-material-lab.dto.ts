import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateMaterialLabDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    @MinLength(3)
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    existencias:number;
}
