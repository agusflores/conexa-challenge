import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFilmDTO {
  @ApiProperty({ example: 'A New Hope', description: 'Título de la película' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 4, description: 'ID del episodio' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  episodeId!: number;

  @ApiProperty({
    example: 'George Lucas',
    description: 'Director de la película',
  })
  @IsString()
  @IsNotEmpty()
  director!: string;

  @ApiProperty({
    example: 'Gary Kurtz',
    description: 'Productor de la película',
  })
  @IsString()
  @IsNotEmpty()
  producer!: string;

  @ApiProperty({
    example: 'It is a period of civil war.',
    description: 'Texto de apertura',
  })
  @IsString()
  @IsNotEmpty()
  openingCrawl!: string;

  @ApiProperty({
    example: '1977-05-25',
    description: 'Fecha de estreno',
  })
  @IsDateString()
  releaseDate!: string;
}
