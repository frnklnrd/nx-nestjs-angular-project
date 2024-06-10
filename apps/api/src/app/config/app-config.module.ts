import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration/configuration';
import { AppDbConfigModule } from './db/app-db-config.module';

@Module({
  imports: [
    //-------------------------------------------------
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: false, // True in production
      load: [configuration],
    }),
    //-------------------------------------------------
    AppDbConfigModule,
    //-------------------------------------------------
  ],
})
export class AppConfigModule {
  protected readonly logger = new Logger(AppConfigModule.name);

  constructor() {
    this.logger.debug('configuration', configuration);
  }
}
