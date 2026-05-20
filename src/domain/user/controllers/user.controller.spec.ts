import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUser = {
    id: '095814ac-5575-41bf-a280-21ef9d11b656',
    username: 'Username123',
    role: 'REGULAR',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios', async () => {
      userService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('findById', () => {
    it('debería retornar un usuario por id', async () => {
      userService.findById.mockResolvedValue(mockUser);

      const result = await controller.findById(
        '095814ac-5575-41bf-a280-21ef9d11b656',
      );

      expect(result).toEqual(mockUser);
    });
  });
});
