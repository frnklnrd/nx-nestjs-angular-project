import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResetPasswordConfirmComponent } from './confirm/reset-password-confirm.component';
import { ResetPasswordRequestComponent } from './request/reset-password-request.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'request', component: ResetPasswordRequestComponent },
      { path: 'confirm', component: ResetPasswordConfirmComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule {}
