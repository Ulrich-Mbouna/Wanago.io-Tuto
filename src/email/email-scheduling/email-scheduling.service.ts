import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EmailScheduleDto } from '../dto/emailSchedule.dto';
import { EmailService } from '../email.service';
import { CronJob } from 'cron';

@Injectable()
export class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  // @Cron('* * * * * *')
  // log() {
  //   console.log('Hello world');
  // }

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date);

    const job = new CronJob(date, async () => {
      await this.emailService.sendEmail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );

    job.start();
  }

  cancelAllScheduleEmail() {
    this.schedulerRegistry.getCronJobs().forEach((job) => job.stop());
  }
}
