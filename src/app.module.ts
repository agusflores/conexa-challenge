import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FilmModule } from './domain/film/film.module';
import { UserModule } from './domain/user/user.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    AuthModule,
    FilmModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(3000),
        SWAPI_BASE_URL: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
