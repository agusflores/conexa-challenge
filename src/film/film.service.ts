import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateFilmDTO } from './dto/create-film-dto';
import { UpdateFilmDTO } from './dto/update-film-dto';
import { SwapiService } from '@/integration/swapi/swapi.service';

@Injectable()
export class FilmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll() {
    return this.prisma.film.findMany({
      orderBy: {
        episodeId: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const film = await this.prisma.film.findUnique({
      where: {
        id,
      },
    });

    if (!film) {
      throw new NotFoundException('La película no existe');
    }

    return film;
  }

  async create(createFilmDTO: CreateFilmDTO) {
    this.validateReleaseDate(createFilmDTO.releaseDate);
    await this.validateUniqueEpisodeId(createFilmDTO.episodeId);
    return this.prisma.film.create({
      data: {
        title: createFilmDTO.title,
        episodeId: createFilmDTO.episodeId,
        director: createFilmDTO.director,
        producer: createFilmDTO.producer,
        openingCrawl: createFilmDTO.openingCrawl,
        releaseDate: new Date(createFilmDTO.releaseDate),
      },
    });
  }

  async update(id: string, updateFilmDTO: UpdateFilmDTO) {
    this.validateReleaseDate(updateFilmDTO.releaseDate);
    await this.validateUniqueEpisodeId(updateFilmDTO.episodeId, id);
    await this.findOne(id);
    return this.prisma.film.update({
      where: {
        id,
      },
      data: {
        ...(updateFilmDTO.title && {
          title: updateFilmDTO.title,
        }),
        ...(updateFilmDTO.episodeId && {
          episodeId: updateFilmDTO.episodeId,
        }),
        ...(updateFilmDTO.director && {
          director: updateFilmDTO.director,
        }),
        ...(updateFilmDTO.producer && {
          producer: updateFilmDTO.producer,
        }),
        ...(updateFilmDTO.openingCrawl && {
          openingCrawl: updateFilmDTO.openingCrawl,
        }),
        ...(updateFilmDTO.releaseDate && {
          releaseDate: new Date(updateFilmDTO.releaseDate),
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.film.delete({
      where: {
        id,
      },
    });

    return {
      message: 'La película fue eliminada exitosamente',
    };
  }

  async syncFilms() {
    const swapiFilms = await this.swapiService.getFilms();
    for (const swapiFilm of swapiFilms) {
      const film = await this.swapiService.getFilmById(swapiFilm.uid);
      await this.prisma.film.upsert({
        where: {
          externalId: film.uid,
        },
        update: {
          title: film.properties.title,
          episodeId: film.properties.episode_id,
          director: film.properties.director,
          producer: film.properties.producer,
          openingCrawl: film.properties.opening_crawl,
          releaseDate: new Date(film.properties.release_date),
        },
        create: {
          externalId: film.uid,
          title: film.properties.title,
          episodeId: film.properties.episode_id,
          director: film.properties.director,
          producer: film.properties.producer,
          openingCrawl: film.properties.opening_crawl,
          releaseDate: new Date(film.properties.release_date),
        },
      });
    }

    return {
      message: 'Las películas fueron sincronizadas exitosamente',
      synced: swapiFilms.length,
    };
  }

  private validateReleaseDate(releaseDate?: string) {
    if (releaseDate && new Date(releaseDate) > new Date()) {
      throw new ConflictException('La fecha de lanzamiento no es válida');
    }
  }

  private async validateUniqueEpisodeId(
    episodeId?: number,
    excludeId?: string,
  ) {
    const existingFilm = await this.prisma.film.findFirst({
      where: {
        episodeId,
        ...(excludeId
          ? {
              id: {
                not: excludeId,
              },
            }
          : {}),
      },
    });

    if (existingFilm) {
      throw new ConflictException(
        `La película con episodeId ${episodeId} ya existe`,
      );
    }
  }
}
