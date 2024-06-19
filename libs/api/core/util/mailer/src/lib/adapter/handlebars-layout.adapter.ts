/* eslint-disable @typescript-eslint/no-explicit-any */
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { compile, registerPartial } from 'handlebars';
import * as path from 'path';

export class HandlebarsLayoutAdapter extends HandlebarsAdapter {
  protected readonly logger = new Logger(HandlebarsLayoutAdapter.name);

  constructor(
    private readonly layoutsDir: string,
    private readonly partialsDir: string,
    private readonly emailsDir: string
  ) {
    super();
    // this.loadPartials();
  }

  private loadPartials() {
    this.logger.debug('loadPartials - init');

    const partialFiles = fs.readdirSync(this.partialsDir);

    partialFiles.forEach((filename) => {
      this.logger.debug('filename', filename);

      const matches = /^([^.]+).hbs$/.exec(filename);

      if (!matches) {
        return;
      }

      const partialName = path.basename(filename, '.hbs');

      this.logger.debug('partialName', partialName);

      const partialTemplate = fs.readFileSync(
        path.join(this.partialsDir, filename),
        'utf-8'
      );

      this.logger.debug('partialTemplate', partialTemplate);

      const compiledPartial = compile(partialTemplate);

      this.logger.debug('compiledPartial', compiledPartial);

      registerPartial(partialName, compiledPartial);
    });

    this.logger.debug('loadPartials - end');
  }

  override compile(mail: any, callback: any, options: any) {
    this.logger.debug('compile - init');

    if (mail.data.context && mail.data.context.layout) {
      const layoutPath = path.join(
        this.layoutsDir,
        `${mail.data.context.layout}.hbs`
      );
      const templatePath = path.join(
        this.emailsDir,
        `${mail.data.template}.hbs`
      );

      const layout = fs.readFileSync(layoutPath, 'utf-8');
      const template = fs.readFileSync(templatePath, 'utf-8');

      const compiledLayout = compile(layout);
      const compiledTemplate = compile(template);

      const mergedTemplate = compiledLayout({
        ...mail.data.context,
        body: compiledTemplate(mail.data.context)
      });

      mail.data.html = mergedTemplate;
      return callback();
    } else {
      super.compile(mail, callback, options);
    }

    this.logger.debug('compile - end');
  }
}
