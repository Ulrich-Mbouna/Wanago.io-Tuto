import { User } from '../../user/entities/user.entity';

const mockUser: User = {
  isTwoFactorAuthenticationEnabled: false,
  id: 1,
  email: 'msus1@gmail.com',
  name: 'John',
  password: '12345678',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
  files: [],
};

export default mockUser;
