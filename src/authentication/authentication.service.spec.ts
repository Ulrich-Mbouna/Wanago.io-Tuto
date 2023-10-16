import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import mockJwtService from '../utils/mocks/jwt.service';
import mockConfigService from '../utils/mocks/config.service';
import bcrypt from 'bcrypt';
import mockUser from '../utils/mocks/user.mock';

jest.mock('bcrypt');

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userService: UserService;
  let userData: User;
  let bcryptCompare: jest.Mock;
  let findUser: jest.Mock;
  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
    userData = { ...mockUser };
    findUser = jest.fn().mockResolvedValue(userData);
    const userRepository = {
      findOne: findUser,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthenticationService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });

  describe('When creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;

      expect(
        typeof authenticationService.getCookieWithJwtAccessToken(userId),
      ).toEqual('string');
    });
  });

  describe('When getting authenticate user data', () => {
    it('should get user by email', async () => {
      const getByEmailSpy = jest.spyOn(userService, 'getByEmail');
      // const getByIdSpy = jest.spyOn(userService, 'getById');

      await authenticationService.getAuthenticateUser(
        'msus1@gmail.com',
        '12345678',
      );
      expect(getByEmailSpy).toBeCalledTimes(1);
    });

    describe('And password is invalid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('Should throw ans error', async () => {
        await expect(
          authenticationService.getAuthenticateUser(
            'msus1@gmail.com',
            '12345678',
          ),
        ).rejects.toThrow();
      });
    });

    describe('And password is valid', () => {
      beforeEach(async () => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('And the use is found in database', () => {
        beforeEach(async () => {
          findUser.mockResolvedValue(userData);
        });

        it('Should return user data', async () => {
          const user = await authenticationService.getAuthenticateUser(
            'msus1@gmail.com',
            '12345678',
          );

          expect(user).toBe(userData);
        });
      });

      describe('And the user is not found in database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });

        it('Should thrown and error', async () => {
          const user = authenticationService.getAuthenticateUser(
            'msus1@gmail.com',
            '12345678',
          );

          await expect(user).rejects.toThrow();
        });
      });
    });
  });
});
