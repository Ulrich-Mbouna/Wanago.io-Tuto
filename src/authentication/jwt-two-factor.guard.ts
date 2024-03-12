import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class JwtTwoFactorGuard extends AuthGuard('jwt-two-factor') {}
