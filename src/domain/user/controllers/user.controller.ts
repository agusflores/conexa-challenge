import { Roles } from '@/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Retorna todos los usuarios ordenados por username',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - solo ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Retorna los datos de un usuario específico',
  })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - solo ADMIN' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }
}
