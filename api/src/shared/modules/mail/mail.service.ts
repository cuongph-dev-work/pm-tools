import { Injectable, Logger } from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JOB_NAME_ENUM, QUEUE_NAME_ENUM } from '@configs/enum/app';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IResetPasswordData } from './mail.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(QUEUE_NAME_ENUM.MAIL) private readonly mailQueue: Queue,
    private readonly i18n: I18nService,
  ) {}

  private logger = new Logger(MailService.name);

  async sendPasswordResetMail(data: IResetPasswordData) {
    this.logger.log('prepare mail option');
    const mailOption: ISendMailOptions = {
      to: data.to,
      subject: this.i18n.t('mail.resetPassword.subject'),
      template: 'reset-password',
      context: {
        resetLink: `${data.redirectUrl}?token=${data.resetToken}`,
      },
    };

    this.logger.log('Add job to mail queue');
    return this.mailQueue.add(JOB_NAME_ENUM.RESET_PASSWORD, mailOption);
  }
}
