import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigUtilService } from './service/config-util.service';

@NgModule({
  imports: [CommonModule],
  providers: [ConfigUtilService]
})
export class AppCoreUtilConfigModule {}
