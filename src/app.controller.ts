import { Controller, Get, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import JwtAuthenticationGuard from "./authentication/jwt-authentication.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
