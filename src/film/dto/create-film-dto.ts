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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  episodeId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  director!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producer!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  openingCrawl!: string;

  @ApiProperty()
  @IsDateString()
  releaseDate!: string;
}
