import { Expose } from 'class-transformer';

export class FilmDTO {
  @Expose()
  id!: string;
  @Expose()
  title!: string;
  @Expose()
  episodeId!: number;
  @Expose()
  director!: string;
  @Expose()
  producer!: string;
  @Expose()
  openingCrawl!: string;
  @Expose()
  releaseDate!: Date;
  @Expose()
  externalId!: Date;
}
