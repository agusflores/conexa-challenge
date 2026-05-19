import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('Film not found');
    }

    return film;
  }

  async create(dto: CreateFilmDTO) {
    return this.prisma.film.create({
      data: {
        title: dto.title,
        episodeId: dto.episodeId,
        director: dto.director,
        producer: dto.producer,
        openingCrawl: dto.openingCrawl,
        releaseDate: new Date(dto.releaseDate),
      },
    });
  }

  async update(id: string, dto: UpdateFilmDTO) {
    await this.findOne(id);

    return this.prisma.film.update({
      where: {
        id,
      },
      data: {
        ...(dto.title && {
          title: dto.title,
        }),
        ...(dto.episodeId && {
          episodeId: dto.episodeId,
        }),
        ...(dto.director && {
          director: dto.director,
        }),
        ...(dto.producer && {
          producer: dto.producer,
        }),
        ...(dto.openingCrawl && {
          openingCrawl: dto.openingCrawl,
        }),
        ...(dto.releaseDate && {
          releaseDate: new Date(dto.releaseDate),
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
      message: 'Film deleted successfully',
    };
  }

  async syncFilms() {
    const swapiFilms = await this.swapiService.getFilms();
    console.log(swapiFilms);
    for (const swapiFilm of swapiFilms) {
      const film = await this.swapiService.getFilmById(swapiFilm.uid);
      console.log(film);
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
      message: 'Films synchronized successfully',
      synced: swapiFilms.length,
    };
  }
}
