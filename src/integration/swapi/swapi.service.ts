import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SwapiFilmDTO } from './dto/swapi-film.dto';
import { SwapiFilmsResponseDTO } from './dto/swapi-films-response.dto';
import { SwapiFilmResponseDTO } from './dto/swapi-film-response.dto';

@Injectable()
export class SwapiService {
  constructor(private readonly httpService: HttpService) {}

  async getFilms(): Promise<SwapiFilmDTO[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmsResponseDTO>(
          `${process.env.SWAPI_BASE_URL}/films`,
        ),
      );

      return response.data.result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException('Error fetching films from SWAPI');
    }
  }

  async getFilmById(id: string): Promise<SwapiFilmDTO> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmResponseDTO>(
          `${process.env.SWAPI_BASE_URL}/films/${id}`,
        ),
      );

      return response.data.result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException('Error fetching film from SWAPI');
    }
  }
}
