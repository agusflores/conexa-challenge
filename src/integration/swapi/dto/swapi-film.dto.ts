import { SwapiFilmPropertiesDTO } from './swapi-film-properties.dto';

export class SwapiFilmDTO {
  uid!: string;
  _id!: string;
  __v!: number;
  description!: string;
  properties!: SwapiFilmPropertiesDTO;
}
