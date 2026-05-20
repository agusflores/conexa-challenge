import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignUpDTO } from '@/auth/dto/sign-up-user.dto';
import { SignInDTO } from '@/auth/dto/sign-in-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  @Post('register')
  register(@Body() dto: SignUpDTO) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  login(@Body() dto: SignInDTO) {
    return this.authService.signIn(dto);
  }
}
