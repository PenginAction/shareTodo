import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockUser = {
  id: 1,
  name: 'Test User1',
  password: 'TestPassword1',
};

describe('UserServiceTest', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createUser', () => {
    it('should pass create user', async () => {
      const createUserInput = {
        name: 'test user1',
        email: 'test1@example.com',
        password: 'TestPassword1',
      };
      const hashPassword = 'HashTestPassword1';
      const expected = { id: 1, ...createUserInput, password: hashPassword };
      mockPrismaService.user.create.mockResolvedValue(expected);

      const result = await userService.createUser(createUserInput);
      expect(result).toEqual(expected);
    });
  });

  describe('getUsers', () => {
    it('should pass get users', async () => {
      const email = 'test1@example.com';
      const expected = [
        {
          id: 1,
          name: 'Test User1',
          email: 'test1@example.com',
          password: 'hashPassword1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Test User2',
          email: 'test2@example.com',
          password: 'hashPassword2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.user.findUnique.mockResolvedValue(expected);

      const result = await userService.getUsers(email);
      expect(result).toEqual(expected);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findOrCreateUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should find an existing user', async () => {
      const createUserInput = {
        name: 'Test User1',
        email: 'test1@example.com',
        password: 'TestPassword1',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const user = await userService.findOrCreateUser(createUserInput);

      expect(user).toEqual(mockUser);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should create a new user if not found', async () => {
      const createUserInput = {
        name: 'Test User1',
        email: 'test1@example.com',
        password: 'TestPassword1',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const user = await userService.findOrCreateUser(createUserInput);
      expect(user).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });
  });
});
