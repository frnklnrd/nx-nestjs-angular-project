/* eslint-disable @typescript-eslint/no-explicit-any */
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerUtilService } from './service/mailer-util.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        let templateAdapter = null;
        switch (configService.get<string>('mailer.template.adapter')) {
          case 'handlerbars':
            templateAdapter = new HandlebarsAdapter(); // or new PugAdapter() or new EjsAdapter()
            break;

          default:
            templateAdapter = new HandlebarsAdapter(); // or new PugAdapter() or new EjsAdapter()
            break;
        }
        return {
          transport: configService.get<TransportType>(
            'mailer.transports.default'
          ) as TransportType,
          defaults: {
            from: configService.get<string>('mailer.defaults.from') as string
          },
          preview: configService.get<boolean>('mailer.preview') as boolean,
          template: {
            dir: configService.get<string>('mailer.template.dir') as string,
            adapter: templateAdapter,
            options: {
              strict: configService.get<boolean>(
                'mailer.template.options.strict'
              ) as boolean
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
