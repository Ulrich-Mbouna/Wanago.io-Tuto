import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When getting user by email', () => {
    describe('and credential match', () => {
      let user: User;

      beforeEach(async () => {
        user = new User();
        findOne.mockResolvedValue(new Promise((resolve) => resolve(user)));
      });
      it('Return a user', async () => {
        const fetchedUser = await service.getByEmail('tamptapion@gmail.com');
        expect(fetchedUser).toEqual(user);
      });
    });
    describe("And the User doesn't match", () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('it Should throw en error', async () => {
        await expect(
          service.getByEmail('tamptapion@gmail.com'),
        ).rejects.toThrow();
      });
    });
  });
});
