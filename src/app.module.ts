import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FilmModule } from './domain/film/film.module';
import { UserModule } from './domain/user/user.module';

@Module({
  imports: [AuthModule, FilmModule, UserModule],
})
export class AppModule {}
