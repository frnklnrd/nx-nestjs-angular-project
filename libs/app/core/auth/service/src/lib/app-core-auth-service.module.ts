import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthCoreService } from './service/auth-core.service';

@NgModule({
  imports: [CommonModule],
  providers: [AuthCoreService]
})
export class AppCoreAuthCoreServiceModule {}
