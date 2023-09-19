import { Test } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { User } from '../user/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import mockUser from '../utils/mocks/user.mock';
import { UserService } from '../user/user.service';
import mockConfigService from '../utils/mocks/config.service';
import { JwtService } from '@nestjs/jwt';
import mockJwtService from '../utils/mocks/jwt.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let app: INestApplication;
  let userData: User;

  // beforeEach(async () => {
  //   userData = { ...userMock };
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [AuthenticationController],
  //     providers: [AuthenticationService],
  //   }).compile();
  //
  //   controller = module.get<AuthenticationController>(AuthenticationController);
  // });

  beforeEach(async () => {
    userData = { ...mockUser };
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        UserService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('When registring a User', () => {
    describe('And provide correct data ', () => {
      it('Should return user data without password', () => {
        const expectedData = { ...mockUser };

        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: mockUser.name,
            email: mockUser.email,
            password: '12345678',
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('And provide wrong credentials', () => {
      it('Should throw and Error', async () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: mockUser.name,
          })
          .expect(400);
      });
    });
  });
});
