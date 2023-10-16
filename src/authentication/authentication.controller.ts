import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  UseGuards,
  HttpStatus,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RequestWithUser } from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { response, Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { JwtRefreshTokenStrategy } from './JwtRefreshTokenStrategy';

@Controller('authentication')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createAuthenticationDto: RegisterDto) {
    return this.authenticationService.register(createAuthenticationDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.cookie,
      user.id,
    );

    response.setHeader('Set-Cookie', [
      refreshTokenCookie.cookie,
      accessTokenCookie,
    ]);
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.userService.removeRefreshToken(request.user.id);
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );

    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard, JwtRefreshTokenStrategy)
  @Get('refresh')
  refresh(@Req() req: RequestWithUser, @Res() res: Response) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(req.user.id);

    res.setHeader('Set-Cookie', accessTokenCookie);

    return res.send(req.user);
  }
}
