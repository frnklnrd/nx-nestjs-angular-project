/* eslint-disable @typescript-eslint/no-explicit-any */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { AbstractAppService } from '@project/api-core-api';

@Injectable()
export class MailerUtilService extends AbstractAppService {
  protected getClassName(): string {
    return MailerUtilService.name;
  }

  constructor(private mailerService: MailerService) {
    super();
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    useTemplate: boolean;
    templateName?: string;
    templateContext: any;
    text?: string;
    html?: string;
  }) {
    this.logger.debug('sendEmail - init');

    if (options.useTemplate) {
      await this.mailerService
        .sendMail({
          to: options.to,
          // from: '"Support Team" <support@example.com>', // override default from
          subject: options.subject,
          template: options.templateName, // `.hbs` extension is appended automatically
          context: Object.assign({}, options.templateContext ?? {})
        })
        .then((response) => {
          this.logger.debug('sendEmail - response', response);
        })
        .catch((error) => {
          this.logger.debug('sendEmail - error', error);
        });
    } else {
      await this.mailerService
        .sendMail({
          to: options.to,
          // from: '"Support Team" <support@example.com>', // override default from
          subject: options.subject,
          text: options.text as string,
          html: options.html as string
        })
        .then((response) => {
          this.logger.debug('sendEmail - response', response);
        })
        .catch((error) => {
          this.logger.debug('sendEmail - error', error);
        });
    }

    this.logger.debug('sendEmail - end');
  }
}
