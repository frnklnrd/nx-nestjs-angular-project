/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule, Configuration } from './generated';

@NgModule({
  imports: [CommonModule, ApiModule],
  providers: [
    {
      provide: Configuration,
      useValue: new Configuration()
    }
  ]
})
export class ApiClientNgApiConnectorModule {}
