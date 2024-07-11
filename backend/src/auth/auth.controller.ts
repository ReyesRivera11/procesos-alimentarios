import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req , Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { AuthGuard, AuthGuardAdmin } from './auth.guard';
import { Request, Response } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './roles/roles.guard';
import { Role } from './roles/role.enum';
import { Auth } from './decorators/auth.decorator';

interface RequestWithUser extends Request {
  user:{
    sub: string;
    role: string;
  }
}


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    res.setHeader('Authorization', `Bearer ${result.token}`);
    return result;
  }
  @Get("/prueba-vercel")
  async pruebavercel(){
    return "This is a test 2"
  }
  
  @Get("prueba")
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard,RolesGuard)
  @Auth(Role.ALUMNO)
  async prueba(
    @Req()req: RequestWithUser,
  ){
    return this.authService.profile(req.user);
  }

  @Get("verifyToken")
  @UseGuards(AuthGuard)
  async verifyUser(
    @Req() request,
  ) {
    return this.authService.verifyToken(request.user);
  }

}
