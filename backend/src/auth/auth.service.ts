import { HttpException, HttpStatus, Injectable, NotFoundException, Request, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alumnos } from 'src/alumnos/schemas/alumno-schema';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Administrador } from 'src/admin/schemas/admin-schema';
import { Role } from './roles/role.enum';
import { Profesores } from 'src/profesores/schemas/profesores-schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Alumnos.name) private alumnosModel: Model<Alumnos>,
        @InjectModel(Administrador.name) private adminModel: Model<Administrador>,
        @InjectModel(Profesores.name) private profesorModel: Model<Profesores>,
        private jwtSvc: JwtService
    ) { }

    async login(loginDto: LoginDto) {
        try {
            const user = await this.alumnosModel.findOne({ matricula: loginDto.username }).exec();
            const admin = !user ? await this.adminModel.findOne({ correo: loginDto.username }).exec() : null;
            const docente = !user && !admin ? await this.profesorModel.findOne({ correo: loginDto.username }).exec() : null;

            if (user || admin || docente) {
                const entity = user || admin || docente;
                const { password, ...rest } = entity.toObject();
                const payload = { sub: entity._id, role: user ? Role.ALUMNO : admin ? Role.ADMIN :Role.DOCENTE };
                const token = this.jwtSvc.sign(payload);

                if (entity.password === loginDto.password) {
                    return { user: {...rest,role: user ? Role.ALUMNO : admin ? Role.ADMIN :Role.DOCENTE}, token };
                }                

                const isPasswordValid = await bcrypt.compare(loginDto.password, entity.password);

                if (!isPasswordValid) {
                    throw new HttpException("La contraseña es incorrecta.", HttpStatus.UNAUTHORIZED);
                }

                return { user: {...rest,role: user ? Role.ALUMNO : admin ? Role.ADMIN :Role.DOCENTE}, token };
            }

            throw new NotFoundException("El usuario no se encuentra registrado.");

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async verifyToken(@Request() request,) {
        try {
            const user = await this.alumnosModel.findById(request.sub);
            const admin = !user && await this.adminModel.findById(request.sub);
            const docente = !user && !admin && await this.profesorModel.findById(request.sub);

            if(user || admin || docente){
                const entity = user || admin || docente;
                const { password, ...rest } = entity.toObject();
                return {...rest,role: user ? Role.ALUMNO : admin ? Role.ADMIN :Role.DOCENTE,};
            }
            throw new NotFoundException("El usuario no se encuentra registrado");
           
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async profile({ sub, role }: { sub: string, role: string }) {
        if (role !== Role.ALUMNO ) throw new UnauthorizedException("Usuario no autorizado.")
        return await this.alumnosModel.findById(sub);
    }


}
