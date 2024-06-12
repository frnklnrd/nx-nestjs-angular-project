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

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
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
export class ResetPasswordRequestComponent
  extends AbstractAppFeatureComponent
  implements OnInit
{
  protected authService: AuthCoreService =
    inject<AuthCoreService>(AuthCoreService);

  protected resetPasswordRequestForm: FormGroup;

  constructor(public layoutService: LayoutService, protected fb: FormBuilder) {
    super();
    this.resetPasswordRequestForm = this.fb.group({
      usernameOrEmail: new FormControl(
        { value: null, disabled: false },
        Validators.compose([Validators.required, Validators.email])
      )
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loader.clear();
  }

  protected onClickRequestResetPassword(): void {
    if (!this.resetPasswordRequestForm.valid) {
      return;
    }

    this.loader.start('reset-password-request');

    this.addSubscription(
      this.authService
        .resetPasswordRequest(this.resetPasswordRequestForm.getRawValue())
        .pipe(take(1))
        .subscribe({
          next: (data: boolean) => {
            if (data) {
              this.loader.stop('reset-password-request');

              this.messageService.add({
                key: 'app-layout-message-box',
                severity: 'success',
                summary: this.translate.instant(
                  _i18n('layout.message.confirmation.successHeader')
                ),
                detail: this.translate.instant(
                  _i18n('reset-password.confirmation.requestSuccessDetail')
                )
              });

              setTimeout(() => {
                this.router.navigate([
                  this.configService.getAppRoute('AUTH_RESET_PASSWORD_CONFIRM')
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
