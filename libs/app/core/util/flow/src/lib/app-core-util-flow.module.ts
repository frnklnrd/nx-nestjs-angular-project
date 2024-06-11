import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlowUtilService } from './service/flow-util.service';

@NgModule({
  imports: [CommonModule],
  providers: [FlowUtilService]
})
export class AppCoreUtilFlowModule {}
