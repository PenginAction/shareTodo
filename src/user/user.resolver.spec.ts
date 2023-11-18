import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { GetUserArgs } from './dto/getUser.args';

describe('UserResolverTest', () => {
  let userResolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn().mockResolvedValue([
              {
                id: 1,
                name: 'Test User1',
                email: 'test1@example.com',
                password: 'hashPassword1',
              },
              {
                id: 2,
                name: 'Test User2',
                email: 'test2@example.com',
                password: 'hashPassword2',
              },
            ]),
            createUser: jest.fn((input) => {
              if (!input.name) {
                return Promise.reject(new Error('Name is empty'));
              }
              if (!input.email) {
                return Promise.reject(new Error('Invalid email'));
              }
              if (input.password.length < 8) {
                return Promise.reject(new Error('Short password'))
              }
              return Promise.resolve({
                id: 1,
                name: input.name,
                email: input.email,
                password: 'HashTestPassword1',
              });
            }),
          },
        },
      ],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should pass create user', async () => {
      const createUserInput = {
        name: 'Test User1',
        email: 'test1@example.com',
        password: 'TestPassword1',
      };
      const hashPassword = 'HashTestPassword1';
      const expected = { id: 1, ...createUserInput, password: hashPassword };

      const result = await userResolver.createUser(createUserInput);
      expect(result).toEqual(expected);
    });

    it('should fail validation for name is empty', async () => {
      const createUserInput = {
        name: '',
        email: 'test1@example.com',
        password: 'TestPassword1',
      };
      const hashPassword = 'HashTestPassword1';
      const expected = { id: 1, ...createUserInput, password: hashPassword };

      await expect(userResolver.createUser(expected)).rejects.toThrow();
    });

    it('should fail validation for invalid email', async () => {
      const createUserInput = {
        name: 'Test User1',
        email: '',
        password: 'TestPassword1',
      };
      const hashPassword = 'HashTestPassword1';
      const expected = { id: 1, ...createUserInput, password: hashPassword };

      await expect(userResolver.createUser(expected)).rejects.toThrow();

    });

    it('should fail validation for short password', async () => {
      const createUserInput = {
        name: 'Test User1',
        email: 'test1@example.com',
        password: 'Test123',
      };
      const hashPassword = 'Hash123';
      const expected = { id: 1, ...createUserInput, password: hashPassword };

      await expect(userResolver.createUser(expected)).rejects.toThrow();
    });
  });

  describe('getUsers', () => {
    it('valid', async () => {
      const getUsersArgs: GetUserArgs = {
        email: 'test1@example.com',
      };
      const expected = [
        {
          id: 1,
          name: 'Test User1',
          email: 'test1@example.com',
          password: 'hashPassword1',
        },
        {
          id: 2,
          name: 'Test User2',
          email: 'test2@example.com',
          password: 'hashPassword2',
        },
      ];

      const result = await userResolver.getUsers(getUsersArgs);
      expect(result).toEqual(expected);
    });
  });
});
