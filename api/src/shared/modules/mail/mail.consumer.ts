import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { JOB_NAME_ENUM, QUEUE_NAME_ENUM } from '@configs/enum/app';

@Processor(QUEUE_NAME_ENUM.MAIL)
export class MailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  private logger = new Logger(MailConsumer.name);

  async process(job: Job<ISendMailOptions>) {
    try {
      switch (job.name as JOB_NAME_ENUM) {
        case JOB_NAME_ENUM.RESET_PASSWORD:
          await this.mailerService.sendMail(job.data);
          break;
        default:
          throw new Error(`Job name ${job.name} not found`);
      }
      this.logger.log(`Email ${job.data.template || ''} has been sent with context ${JSON.stringify(job.data.context) || ''}`);
    } catch (e) {
      this.logger.error(`An error occur while sending email ${job.data.template || ''} with context ${JSON.stringify(job.data.context) || ''}`, e);
    }
  }
}
