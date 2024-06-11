import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppConfigModule } from './config/app-config.module';
import { AppAuthModule } from './auth/app.auth.module';
import { AppResourcesModule } from './resources/app.resources.module';

@Module({
  imports: [
    // ---------------
    AppConfigModule,
    // ---------------
    AppAuthModule,
    // ---------------
    AppResourcesModule,
    // ---------------
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
      serveRoot: '/assets'
    })
    // ---------------
  ],
  controllers: [
    // AppController
  ],
  providers: [
    // AppService
  ],
  exports: []
})
export class AppModule {}
