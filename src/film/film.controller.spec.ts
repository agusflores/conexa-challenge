import { Test, TestingModule } from '@nestjs/testing';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';

describe('FilmController', () => {
  let controller: FilmController;
  let filmService: jest.Mocked<FilmService>;

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
    const mockFilmService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      syncFilms: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmController],
      providers: [{ provide: FilmService, useValue: mockFilmService }],
    }).compile();

    controller = module.get<FilmController>(FilmController);
    filmService = module.get(FilmService);
  });

  describe('findAll', () => {
    it('debería retornar todas las películas', async () => {
      filmService.findAll.mockResolvedValue([mockFilm]);

      const result = await controller.findAll();

      expect(result).toEqual([mockFilm]);
    });
  });

  describe('findOne', () => {
    it('debería retornar una película por id', async () => {
      filmService.findOne.mockResolvedValue(mockFilm);

      const result = await controller.findOne('film-123');

      expect(result).toEqual(mockFilm);
    });
  });

  describe('create', () => {
    it('debería crear una película', async () => {
      filmService.create.mockResolvedValue(mockFilm);

      const result = await controller.create({
        title: 'A New Hope',
        episodeId: 4,
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        openingCrawl: 'Text',
        releaseDate: '1977-05-25',
      });

      expect(result).toEqual(mockFilm);
    });
  });

  describe('update', () => {
    it('debería actualizar una película', async () => {
      filmService.update.mockResolvedValue({ ...mockFilm, title: 'Updated' });

      const result = await controller.update('film-123', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('debería eliminar una película', async () => {
      filmService.remove.mockResolvedValue({
        message: 'La película fue eliminada exitosamente',
      });

      const result = await controller.remove('film-123');

      expect(result).toEqual({
        message: 'La película fue eliminada exitosamente',
      });
    });
  });

  describe('syncFilms', () => {
    it('debería sincronizar películas desde SWAPI', async () => {
      filmService.syncFilms.mockResolvedValue({
        message: 'Las películas fueron sincronizadas exitosamente',
        synced: 1,
      });

      const result = await controller.syncFilms();

      expect(result).toEqual({
        message: 'Las películas fueron sincronizadas exitosamente',
        synced: 1,
      });
    });
  });
});
