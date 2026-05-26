import { Test, TestingModule } from '@nestjs/testing';

import { SwapiService } from '@/integration/swapi/swapi.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FilmRepository } from '../repositories/film.repository';
import { FilmDTO } from '../dto/film.dto';
import { PaginatedFilmDTO } from '../dto/paginated-film.dto';
import { FilmService } from './film.service';

describe('FilmService', () => {
  let service: FilmService;
  let filmRepository: jest.Mocked<FilmRepository>;
  let swapiService: jest.Mocked<SwapiService>;

  const mockFilm = {
    id: 'film-123',
    title: 'A New Hope',
    episodeId: 4,
    director: 'George Lucas',
    producer: 'Gary Kurtz',
    releaseDate: new Date('1977-05-25'),
    openingCrawl: 'It is a period of civil war...',
    externalId: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockFilmRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    };

    const mockSwapi = {
      getFilms: jest.fn(),
      getFilmById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmService,
        { provide: FilmRepository, useValue: mockFilmRepository },
        { provide: SwapiService, useValue: mockSwapi },
      ],
    }).compile();

    service = module.get<FilmService>(FilmService);
    filmRepository = module.get(FilmRepository);
    swapiService = module.get(SwapiService);
  });

  describe('findAll', () => {
    it('debería retornar todas las películas paginadas ordenadas por episodeId', async () => {
      filmRepository.findAll.mockResolvedValue([mockFilm]);
      filmRepository.count.mockResolvedValue(50);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toBeInstanceOf(PaginatedFilmDTO);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toBeInstanceOf(FilmDTO);
      expect(result.meta).toEqual({
        total: 50,
        page: 1,
        limit: 10,
        totalPages: 5,
      });
      expect(filmRepository.findAll).toHaveBeenCalledWith(
        {},
        { episodeId: 'asc' },
        0,
        10,
      );
    });
  });

  describe('findById', () => {
    it('debería retornar una película por id', async () => {
      filmRepository.findById.mockResolvedValue(mockFilm);

      const result = await service.findById('film-123');

      expect(result).toBeInstanceOf(FilmDTO);
      expect(result.id).toBe(mockFilm.id);
      expect(result.title).toBe(mockFilm.title);
      expect(result.director).toBe(mockFilm.director);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      filmRepository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('debería crear una película exitosamente', async () => {
      filmRepository.findFirst.mockResolvedValue(null);
      filmRepository.create.mockResolvedValue(mockFilm);

      const result = await service.create({
        title: 'A New Hope',
        episodeId: 4,
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        openingCrawl: 'It is a period of civil war...',
        releaseDate: '1977-05-25',
      });

      expect(result).toEqual(mockFilm);
    });

    it('debería lanzar ConflictException si el episodeId ya existe', async () => {
      filmRepository.findFirst.mockResolvedValue(mockFilm);

      await expect(
        service.create({
          title: 'A New Hope',
          episodeId: 4,
          director: 'George Lucas',
          producer: 'Gary Kurtz',
          openingCrawl: 'It is a period of civil war...',
          releaseDate: '1977-05-25',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('debería actualizar una película exitosamente', async () => {
      filmRepository.findById.mockResolvedValue(mockFilm);
      filmRepository.findFirst.mockResolvedValue(null);
      filmRepository.update.mockResolvedValue({
        ...mockFilm,
        title: 'Updated',
      });

      const result = await service.update('film-123', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('debería eliminar una película exitosamente', async () => {
      filmRepository.findById.mockResolvedValue(mockFilm);
      filmRepository.delete.mockResolvedValue(mockFilm);

      const result = await service.remove('film-123');

      expect(result).toEqual({
        message: 'La película fue eliminada exitosamente',
      });
    });
  });

  describe('syncFilms', () => {
    it('debería sincronizar películas desde SWAPI', async () => {
      swapiService.getFilms.mockResolvedValue([{ uid: '4' }]);
      swapiService.getFilmById.mockResolvedValue({
        uid: '4',
        properties: {
          title: 'A New Hope',
          episode_id: 4,
          director: 'George Lucas',
          producer: 'Gary Kurtz',
          opening_crawl: 'Text',
          release_date: '1977-05-25',
        },
      });
      filmRepository.upsert.mockResolvedValue(mockFilm);

      const result = await service.syncFilms();

      expect(result.synced).toBe(1);
    });
  });
});
