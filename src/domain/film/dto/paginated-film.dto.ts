import { Expose, Type } from 'class-transformer';
import { FilmDTO } from './film.dto';
import { PaginationMetaDTO } from '@/common/dto/pagination-meta.dto';

export class PaginatedFilmDTO {
  @Expose()
  @Type(() => FilmDTO)
  data: FilmDTO[];

  @Expose()
  @Type(() => PaginationMetaDTO)
  meta: PaginationMetaDTO;

  constructor(data: FilmDTO[], meta: PaginationMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}
