import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsInt()
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
