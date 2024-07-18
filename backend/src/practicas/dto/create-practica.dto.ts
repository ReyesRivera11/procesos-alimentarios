import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
class MaterialDto {
    @IsNotEmpty()
    @IsString()
    _id:String;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    cantidad:number;
}
export class CreatePracticaDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    practica: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    profesor:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    asignatura:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    cuatrimestre:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(3)
    grupo:string;

    @IsString()
    @IsNotEmpty()
    fecha:string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>MaterialDto)
    materiales:MaterialDto[];

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(15)
    estado:string;
}
