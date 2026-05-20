import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SwapiService } from '@/integration/swapi/swapi.service';
import { FilmRepository } from '../repositories/film.repository';
import { CreateFilmDTO } from '../dto/create-film.dto';
import { UpdateFilmDTO } from '../dto/update-film.dto';

@Injectable()
export class FilmService {
  constructor(
    private readonly filmRepository: FilmRepository,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll() {
    return this.filmRepository.findAll({
      episodeId: 'asc',
    });
  }

  async findById(id: string) {
    const film = await this.filmRepository.findById({
      id,
    });

    if (!film) {
      throw new NotFoundException('La película no existe');
    }

    return film;
  }

  async create(createFilmDTO: CreateFilmDTO) {
    this.validateReleaseDate(createFilmDTO.releaseDate);
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
    this.validateReleaseDate(updateFilmDTO.releaseDate);
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
      throw new ConflictException('Error al sincronizar películas');
    }
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
