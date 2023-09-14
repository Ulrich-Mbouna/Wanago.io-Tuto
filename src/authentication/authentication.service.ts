import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { PostgresErrorCodes } from '../database/PostgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './tokenPayload.interface';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword,
      });

      createUser.password = undefined;
      return createUser;
    } catch (error) {
      if (error?.code === PostgresErrorCodes.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async getAuthenticateUser(email: string, hashedPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(user.password, hashedPassword);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isSamePassword = await bcrypt.compare(
      hashedPassword,
      plainTextPassword,
    );

    if (!isSamePassword) {
      throw new HttpException(
        'Wrong Credentials provides from compare',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieForLogOut() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }
}
