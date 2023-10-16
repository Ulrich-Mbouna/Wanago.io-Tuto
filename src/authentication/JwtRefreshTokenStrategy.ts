import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from './tokenPayload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),

      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;

    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
