import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilmService } from './film.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { CreateFilmDTO } from './dto/create-film-dto';
import { UpdateFilmDTO } from './dto/update-film-dto';

@ApiTags('Films')
@ApiBearerAuth()
@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.filmService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('sync')
  syncFilms() {
    return this.filmService.syncFilms();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.REGULAR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateFilmDTO) {
    return this.filmService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFilmDTO) {
    return this.filmService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmService.remove(id);
  }
}
