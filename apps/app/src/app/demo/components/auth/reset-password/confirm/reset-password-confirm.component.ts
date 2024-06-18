/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { AuthCoreService } from '@project/app-core-auth-service';
import { AbstractAppFeatureComponent } from '@project/app-module-api-feature';
import { take } from 'rxjs';
import { LayoutService } from '../../../../../layout/service/app.layout.service';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('password2');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `
  ]
})
export class ResetPasswordConfirmComponent
  extends AbstractAppFeatureComponent
  implements OnInit
{
  protected authService: AuthCoreService =
    inject<AuthCoreService>(AuthCoreService);

  protected resetPasswordConfirmForm: FormGroup;

  constructor(public layoutService: LayoutService, protected fb: FormBuilder) {
    super();
    this.resetPasswordConfirmForm = this.fb.group(
      {
        usernameOrEmail: new FormControl(
          { value: null, disabled: false },
          Validators.compose([Validators.required, Validators.email])
        ),
        verificationCode: new FormControl(
          { value: null, disabled: false },
          Validators.compose([Validators.required])
        ),
        newPassword: new FormControl(
          { value: null, disabled: false },
          Validators.compose([Validators.required])
        ),
        newPassword2: new FormControl(
          { value: null, disabled: false },
          Validators.compose([Validators.required])
        )
      },
      { validator: passwordMatchValidator }
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loader.clear();
    this.addSubscription(
      this.route.queryParams.pipe(take(1)).subscribe((params: any) => {
        this.resetPasswordConfirmForm.controls['usernameOrEmail'].setValue(
          params?.email
        );
        this.resetPasswordConfirmForm.controls['verificationCode'].setValue(
          params?.code
        );
      })
    );
  }

  protected onClickConfirmResetPassword(): void {
    if (!this.resetPasswordConfirmForm.valid) {
      return;
    }

    this.loader.start('reset-password-confirm');

    this.addSubscription(
      this.authService
        .resetPasswordConfirm(this.resetPasswordConfirmForm.getRawValue())
        .pipe(take(1))
        .subscribe({
          next: (data: boolean) => {
            if (data) {
              this.loader.stop('reset-password-confirm');

              this.messageService.add({
                key: 'app-layout-message-box',
                severity: 'success',
                summary: this.translate.instant(
                  _i18n('layout.message.confirmation.successHeader')
                ),
                detail: this.translate.instant(
                  _i18n('reset-password.confirmation.confirmSuccessDetail')
                )
              });

              setTimeout(() => {
                this.router.navigate([
                  this.configService.getAppRoute('AUTH_LOGIN')
                ]);
              }, 0);
            }
          },
          error: (error) => this.handleError(error)
        })
    );
  }

  protected onClickReturnToLogin(): void {
    this.router.navigate([this.configService.getAppRoute('AUTH_LOGIN')]);
  }
}
