import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(orderBy?: Prisma.UserOrderByWithRelationInput): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: orderBy || { username: 'asc' },
    });
  }

  findById(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }
}
