import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailSchedulingService } from './email-scheduling.service';
import JwtAuthenticationGuard from '../../authentication/jwt-authentication.guard';
import { EmailScheduleDto } from '../dto/emailSchedule.dto';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(private emailSchedulingService: EmailSchedulingService) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    return this.emailSchedulingService.scheduleEmail(emailSchedule);
  }
}
