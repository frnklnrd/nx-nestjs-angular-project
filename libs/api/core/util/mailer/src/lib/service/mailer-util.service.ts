/* eslint-disable @typescript-eslint/no-explicit-any */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractAppService } from '@project/api-core-api';

@Injectable()
export class MailerUtilService extends AbstractAppService {
  protected getClassName(): string {
    return MailerUtilService.name;
  }

  constructor(
    protected readonly configService: ConfigService,
    protected readonly mailerService: MailerService
  ) {
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

    this.logger.debug('options', options);

    if (options.useTemplate) {
      await this.mailerService
        .sendMail({
          to: options.to,
          // from: '"Support Team" <support@example.com>', // override default from
          subject: options.subject,
          template: options.templateName, // `.hbs` extension is appended automatically
          context: Object.assign(
            {
              layout: this.configService.get<string>(
                'mailer.template.layout'
              ) as string
            },
            options.templateContext ?? {}
          )
        })
        .then((response) => {
          this.logger.debug('response', response);
        })
        .catch((error) => {
          this.logger.debug('error', error);
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
          this.logger.debug('response', response);
        })
        .catch((error) => {
          this.logger.debug('error', error);
        });
    }

    this.logger.debug('sendEmail - end');
  }
}
