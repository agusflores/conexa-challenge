import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: '095814ac-5575-41bf-a280-21ef9d11b656',
    username: 'Username123',
    role: 'REGULAR',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios ordenados por username ascendente', async () => {
      userRepository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
      expect(userRepository.findAll).toHaveBeenCalledWith({
        username: 'asc',
      });
    });
  });

  describe('findById', () => {
    it('debería retornar un usuario por id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(
        '095814ac-5575-41bf-a280-21ef9d11b656',
      );

      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        service.findById('095814ac-5575-41bf-a280-21ef9d11b656'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
