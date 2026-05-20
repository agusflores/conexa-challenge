import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    password: 'hashedPassword',
    role: Role.REGULAR,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const mockJwt = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  describe('signUp', () => {
    it('debería crear un usuario y retornar un token', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await service.signUp({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si el usuario ya existe', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.signUp({
          username: 'testuser',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    it('debería retornar un token con credenciales válidas', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.signIn({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.signIn({
          username: 'nonexistent',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.signIn({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
