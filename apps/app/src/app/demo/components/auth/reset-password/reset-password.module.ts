import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ResetPasswordConfirmComponent } from './confirm/reset-password-confirm.component';
import { ResetPasswordRequestComponent } from './request/reset-password-request.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputMaskModule,
    FormsModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ResetPasswordRequestComponent, ResetPasswordConfirmComponent]
})
export class ResetPasswordModule {}
