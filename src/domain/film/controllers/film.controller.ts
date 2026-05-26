import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { FilmService } from '../services/film.service';
import { CreateFilmDTO } from '../dto/create-film.dto';
import { UpdateFilmDTO } from '../dto/update-film.dto';
import { FilmQueryDTO } from '../dto/film-query.dto';
@ApiTags('Films')
@ApiBearerAuth()
@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @ApiOperation({
    summary: 'Listar todas las películas',
    description: 'Retorna todas las películas ordenadas por episodeId',
  })
  @ApiResponse({ status: 200, description: 'Lista de películas' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: FilmQueryDTO) {
    return this.filmService.findAll(query);
  }

  @ApiOperation({
    summary: 'Sincronizar películas con SWAPI',
    description:
      'Consigue películas de la API externa SWAPI y las guarda en la base de datos local',
  })
  @ApiResponse({
    status: 200,
    description: 'Películas sincronizadas exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - solo ADMIN puede ejecutar',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('sync')
  syncFilms() {
    return this.filmService.syncFilms();
  }

  @ApiOperation({
    summary: 'Obtener una película por ID',
    description: 'Retorna los datos de una película específica',
  })
  @ApiResponse({ status: 200, description: 'Datos de la película' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - solo ADMIN y REGULAR' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.REGULAR)
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.filmService.findById(id);
  }

  @ApiOperation({
    summary: 'Crear una nueva película',
    description: 'Crea una película en la base de datos local',
  })
  @ApiResponse({ status: 201, description: 'Película creada exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos - validación fallida',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - solo ADMIN' })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - el episodeId ya existe',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateFilmDTO) {
    return this.filmService.create(dto);
  }

  @ApiOperation({
    summary: 'Actualizar una película',
    description: 'Actualiza los datos de una película existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Película actualizada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos - validación fallida',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - solo ADMIN' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - el episodeId ya existe',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFilmDTO) {
    return this.filmService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Eliminar una película',
    description: 'Elimina una película de la base de datos',
  })
  @ApiResponse({ status: 200, description: 'Película eliminada exitosamente' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - token JWT requerido',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - solo ADMIN' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.filmService.remove(id);
  }
}
