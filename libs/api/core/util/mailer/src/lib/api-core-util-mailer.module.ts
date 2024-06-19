/* eslint-disable @typescript-eslint/no-explicit-any */
import { MailerModule } from '@nestjs-modules/mailer';
import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { HandlebarsLayoutAdapter } from './adapter/handlebars-layout.adapter';
import { MailerUtilService } from './service/mailer-util.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: configService.get<TransportType>(
            'mailer.transports.default'
          ) as TransportType,
          defaults: {
            from: configService.get<string>('mailer.defaults.from') as string
          },
          preview: configService.get<boolean>('mailer.preview') as boolean,
          template: {
            // dir: configService.get<string>('mailer.template.dir') as string,
            adapter: new HandlebarsLayoutAdapter(
              path.join(
                configService.get<string>('mailer.template.dir') as string,
                'layouts'
              ),
              path.join(
                configService.get<string>('mailer.template.dir') as string,
                'partials'
              ),
              path.join(
                configService.get<string>('mailer.template.dir') as string,
                'emails'
              )
            ),
            options: {
              strict: true
            }
          }
        };
      },
      inject: [ConfigService]
    })
  ],

  controllers: [],
  providers: [MailerUtilService],
  exports: [MailerUtilService]
})
export class ApiCoreUtilMailerModule {}
