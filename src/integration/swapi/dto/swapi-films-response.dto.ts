import { SwapiFilmDTO } from './swapi-film.dto';

export class SwapiFilmsResponseDTO {
  message!: string;
  result!: SwapiFilmDTO[];
}
