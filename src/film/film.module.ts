import { Module } from '@nestjs/common';

import { FilmController } from './film.controller';
import { FilmService } from './film.service';

import { PrismaModule } from '@/shared/prisma/prisma.module';

import { SwapiModule } from '@/integration/swapi/swapi.module';

@Module({
  imports: [PrismaModule, SwapiModule],
  controllers: [FilmController],
  providers: [FilmService],
})
export class FilmModule {}
