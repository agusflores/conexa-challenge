import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      authService.signUp.mockResolvedValue({ access_token: 'mock-token' });

      const result = await controller.register({
        username: 'newuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(authService.signUp).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    it('debería iniciar sesión exitosamente', async () => {
      authService.signIn.mockResolvedValue({ access_token: 'mock-token' });

      const result = await controller.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
    });
  });
});
