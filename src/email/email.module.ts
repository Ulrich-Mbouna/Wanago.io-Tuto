import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';
import { EmailSchedulingService } from './email-scheduling/email-scheduling.service';
import { EmailSchedulingController } from './email-scheduling/email-scheduling.controller';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController, EmailSchedulingController],
  providers: [EmailService, EmailSchedulingService],
})
export class EmailModule {}
