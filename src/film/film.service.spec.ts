import { Test, TestingModule } from '@nestjs/testing';
import { FilmService } from './film.service';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { SwapiService } from '@/integration/swapi/swapi.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('FilmService', () => {
  let service: FilmService;
  let prisma: jest.Mocked<PrismaService>;
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
    const mockPrisma = {
      film: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
        upsert: jest.fn(),
      },
    };
    const mockSwapi = {
      getFilms: jest.fn(),
      getFilmById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SwapiService, useValue: mockSwapi },
      ],
    }).compile();
    service = module.get<FilmService>(FilmService);
    prisma = module.get(PrismaService);
    swapiService = module.get(SwapiService);
  });

  describe('findAll', () => {
    it('debería retornar todas las películas ordenadas por episodeId', async () => {
      prisma.film.findMany.mockResolvedValue([mockFilm]);
      const result = await service.findAll();
      expect(result).toEqual([mockFilm]);
      expect(prisma.film.findMany).toHaveBeenCalledWith({
        orderBy: { episodeId: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('debería retornar una película por id', async () => {
      prisma.film.findUnique.mockResolvedValue(mockFilm);
      const result = await service.findOne('film-123');
      expect(result).toEqual(mockFilm);
    });
    it('debería lanzar NotFoundException si no existe', async () => {
      prisma.film.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('debería crear una película exitosamente', async () => {
      prisma.film.findFirst.mockResolvedValue(null);
      prisma.film.create.mockResolvedValue(mockFilm);
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
      prisma.film.findFirst.mockResolvedValue(mockFilm);
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
    it('debería lanzar ConflictException si la fecha es futura', async () => {
      await expect(
        service.create({
          title: 'Future Film',
          episodeId: 10,
          director: 'Director',
          producer: 'Producer',
          openingCrawl: 'Text',
          releaseDate: '2099-01-01',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('debería actualizar una película exitosamente', async () => {
      prisma.film.findUnique.mockResolvedValue(mockFilm);
      prisma.film.findFirst.mockResolvedValue(null);
      prisma.film.update.mockResolvedValue({ ...mockFilm, title: 'Updated' });
      const result = await service.update('film-123', { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('debería eliminar una película exitosamente', async () => {
      prisma.film.findUnique.mockResolvedValue(mockFilm);
      prisma.film.delete.mockResolvedValue(mockFilm);
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
      prisma.film.upsert.mockResolvedValue(mockFilm);
      const result = await service.syncFilms();
      expect(result.synced).toBe(1);
    });
  });
});
