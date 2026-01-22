/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from 'generated/prisma/enums';

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'USER' as UserRole,
    createdAt: new Date(),
  };

  const mockRegisterDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockLoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(controller.register).toBeDefined();
    });

    it('should call authService.register with registerDto', async () => {
      const expectedResult = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(mockRegisterDto);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return the result from authService.register', async () => {
      const expectedResult = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(mockRegisterDto);

      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from authService.register', async () => {
      const error = new Error('Registration failed');

      jest.spyOn(authService, 'register').mockRejectedValue(error);

      await expect(controller.register(mockRegisterDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(controller.login).toBeDefined();
    });

    it('should call authService.login with loginDto', async () => {
      const expectedResult = {
        access_token: 'jwt.token.here',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return the result from authService.login', async () => {
      const expectedResult = {
        access_token: 'jwt.token.here',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from authService.login', async () => {
      const error = new Error('Login failed');

      jest.spyOn(authService, 'login').mockRejectedValue(error);

      await expect(controller.login(mockLoginDto)).rejects.toThrow(error);
    });

    it('should return access_token in login response', async () => {
      const accessToken = 'jwt.token.here';
      const expectedResult = {
        access_token: accessToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(mockLoginDto);

      expect(result.access_token).toEqual(accessToken);
    });
  });

  describe('controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have register method', () => {
      expect(controller.register).toBeDefined();
    });

    it('should have login method', () => {
      expect(controller.login).toBeDefined();
    });
  });
});
