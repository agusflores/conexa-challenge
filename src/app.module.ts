import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FilmModule } from './film/film.module';

@Module({
  imports: [AuthModule, FilmModule],
})
export class AppModule {}
