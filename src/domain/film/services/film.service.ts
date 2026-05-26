import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SwapiService } from '@/integration/swapi/swapi.service';
import { FilmRepository } from '../repositories/film.repository';
import { CreateFilmDTO } from '../dto/create-film.dto';
import { UpdateFilmDTO } from '../dto/update-film.dto';
import { FilmDTO } from '../dto/film.dto';
import { plainToInstance } from 'class-transformer';
import { FilmQueryDTO } from '../dto/film-query.dto';
import { PaginatedFilmDTO } from '../dto/paginated-film.dto';
import { Prisma } from '@prisma/client';
import { PaginationMetaDTO } from '@/common/dto/pagination-meta.dto';

@Injectable()
export class FilmService {
  constructor(
    private readonly filmRepository: FilmRepository,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(query: FilmQueryDTO) {
    const { page, limit, title, director } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FilmWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      }),
      ...(director && {
        director: {
          contains: director,
          mode: 'insensitive',
        },
      }),
    };

    const [films, total] = await Promise.all([
      this.filmRepository.findAll(
        where,
        {
          episodeId: 'asc',
        },
        skip,
        limit,
      ),

      this.filmRepository.count(where),
    ]);

    return new PaginatedFilmDTO(
      plainToInstance(FilmDTO, films, {
        excludeExtraneousValues: true,
      }),
      new PaginationMetaDTO(total, page, limit),
    );
  }

  async findById(id: string) {
    const film = await this.filmRepository.findById({
      id,
    });

    if (!film) {
      throw new NotFoundException('La película no existe');
    }

    return plainToInstance(FilmDTO, film, {
      excludeExtraneousValues: true,
    });
  }

  async create(createFilmDTO: CreateFilmDTO) {
    await this.validateUniqueEpisodeId(createFilmDTO.episodeId);
    return this.filmRepository.create({
      title: createFilmDTO.title,
      episodeId: createFilmDTO.episodeId,
      director: createFilmDTO.director,
      producer: createFilmDTO.producer,
      openingCrawl: createFilmDTO.openingCrawl,
      releaseDate: new Date(createFilmDTO.releaseDate),
    });
  }

  async update(id: string, updateFilmDTO: UpdateFilmDTO) {
    await this.validateUniqueEpisodeId(updateFilmDTO.episodeId, id);
    await this.findById(id);
    return this.filmRepository.update(
      {
        id,
      },
      {
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
    );
  }

  async remove(id: string) {
    await this.findById(id);

    await this.filmRepository.delete({
      id,
    });

    return {
      message: 'La película fue eliminada exitosamente',
    };
  }

  async syncFilms() {
    try {
      const swapiFilms = await this.swapiService.getFilms();
      for (const swapiFilm of swapiFilms) {
        const film = await this.swapiService.getFilmById(swapiFilm.uid);
        await this.filmRepository.upsert(
          {
            externalId: film.uid,
          },
          {
            externalId: film.uid,
            title: film.properties.title,
            episodeId: film.properties.episode_id,
            director: film.properties.director,
            producer: film.properties.producer,
            openingCrawl: film.properties.opening_crawl,
            releaseDate: new Date(film.properties.release_date),
          },
          {
            title: film.properties.title,
            episodeId: film.properties.episode_id,
            director: film.properties.director,
            producer: film.properties.producer,
            openingCrawl: film.properties.opening_crawl,
            releaseDate: new Date(film.properties.release_date),
          },
        );
      }

      return {
        message: 'Las películas fueron sincronizadas exitosamente',
        synced: swapiFilms.length,
      };
    } catch (error) {
      console.log(error);
      throw new ConflictException('Error al sincronizar películas');
    }
  }

  private async validateUniqueEpisodeId(
    episodeId?: number,
    excludeId?: string,
  ) {
    const existingFilm = await this.filmRepository.findFirst({
      episodeId,
      ...(excludeId
        ? {
            id: {
              not: excludeId,
            },
          }
        : {}),
    });

    if (existingFilm) {
      throw new ConflictException(
        `La película con episodeId ${episodeId} ya existe`,
      );
    }
  }
}
