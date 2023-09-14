import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';
import { User } from '../user/entities/user.entity';
import { Injectable } from '@nestjs/common'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    console.log({ email, password });
    return this.authenticationService.getAuthenticateUser(email, password);
  }
}
