import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigModule } from './config/app-config.module';
import { AppDemoModule } from './demo/app.demo..module';
import { AppLayoutModule } from './layout/app.layout.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // ----------------------------
    CommonModule,
    // ----------------------------
    AppConfigModule,
    // ----------------------------
    AppRoutingModule,
    // ----------------------------
    AppLayoutModule,
    // ----------------------------
    AppDemoModule
    // ----------------------------
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
