import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SwapiService } from './swapi.service';
import { of } from 'rxjs';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpService: jest.Mocked<HttpService>;
  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwapiService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();
    service = module.get<SwapiService>(SwapiService);
    httpService = module.get(HttpService);
  });

  describe('getFilms', () => {
    it('debería retornar la lista de películas', async () => {
      const mockResponse = {
        data: {
          result: [
            { uid: '4', name: 'A New Hope' },
            { uid: '5', name: 'The Empire Strikes Back' },
          ],
        },
      };
      httpService.get.mockReturnValue(of(mockResponse));
      const result = await service.getFilms();
      expect(result).toEqual([
        { uid: '4', name: 'A New Hope' },
        { uid: '5', name: 'The Empire Strikes Back' },
      ]);
    });
  });

  describe('getFilmById', () => {
    it('debería retornar los detalles de una película', async () => {
      const mockResponse = {
        data: {
          result: {
            uid: '4',
            properties: {
              title: 'A New Hope',
              episode_id: 4,
              director: 'George Lucas',
              producer: 'Gary Kurtz',
              opening_crawl: 'Text',
              release_date: '1977-05-25',
            },
          },
        },
      };
      httpService.get.mockReturnValue(of(mockResponse));
      const result = await service.getFilmById('4');
      expect(result.uid).toBe('4');
      expect(result.properties.title).toBe('A New Hope');
    });
  });
});
