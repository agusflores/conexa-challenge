import { Module } from '@nestjs/common';

import { FilmRepository } from './repositories/film.repository';

import { PrismaModule } from '@/shared/prisma/prisma.module';

import { SwapiModule } from '@/integration/swapi/swapi.module';
import { FilmController } from './controllers/film.controller';
import { FilmService } from './services/film.service';

@Module({
  imports: [PrismaModule, SwapiModule],
  controllers: [FilmController],
  providers: [FilmService, FilmRepository],
})
export class FilmModule {}
