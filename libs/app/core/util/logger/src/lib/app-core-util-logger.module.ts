import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoggerUtilService } from './service/logger-util.service';

@NgModule({
  imports: [CommonModule],
  providers: [LoggerUtilService],
  exports: []
})
export class AppCoreUtilLoggerModule {}
