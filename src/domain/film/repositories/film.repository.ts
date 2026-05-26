import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Film, Prisma } from '@prisma/client';

@Injectable()
export class FilmRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(
    where?: Prisma.FilmWhereInput,
    orderBy?: Prisma.FilmOrderByWithRelationInput,
    skip?: number,
    take?: number,
  ): Promise<Film[]> {
    return this.prisma.film.findMany({
      where,
      orderBy: orderBy || { episodeId: 'asc' },
      skip,
      take,
    });
  }

  count(where?: Prisma.FilmWhereInput): Promise<number> {
    return this.prisma.film.count({
      where,
    });
  }

  findById(where: Prisma.FilmWhereUniqueInput): Promise<Film | null> {
    return this.prisma.film.findUnique({ where });
  }

  findFirst(where: Prisma.FilmWhereInput): Promise<Film | null> {
    return this.prisma.film.findFirst({ where });
  }

  create(data: Prisma.FilmCreateInput): Promise<Film> {
    return this.prisma.film.create({ data });
  }

  update(
    where: Prisma.FilmWhereUniqueInput,
    data: Prisma.FilmUpdateInput,
  ): Promise<Film> {
    return this.prisma.film.update({ where, data });
  }

  delete(where: Prisma.FilmWhereUniqueInput): Promise<Film> {
    return this.prisma.film.delete({ where });
  }

  upsert(
    where: Prisma.FilmWhereUniqueInput,
    create: Prisma.FilmCreateInput,
    update: Prisma.FilmUpdateInput,
  ): Promise<Film> {
    return this.prisma.film.upsert({ where, update, create });
  }
}
