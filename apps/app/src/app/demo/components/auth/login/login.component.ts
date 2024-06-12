import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { AuthCoreService } from '@project/app-core-auth-service';
import { AuthStoreState } from '@project/app-core-auth-store';
import { AbstractAppFeatureComponent } from '@project/app-module-api-feature';
import { take } from 'rxjs';
import { LayoutService } from '../../../../layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
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
export class LoginComponent
  extends AbstractAppFeatureComponent
  implements OnInit
{
  protected authService: AuthCoreService =
    inject<AuthCoreService>(AuthCoreService);

  protected loginForm: FormGroup;

  constructor(public layoutService: LayoutService, protected fb: FormBuilder) {
    super();
    this.loginForm = this.fb.group({
      username: new FormControl(
        { value: null, disabled: false },
        Validators.compose([Validators.required])
      ),
      password: new FormControl(
        { value: null, disabled: false },
        Validators.compose([Validators.required])
      ),
      remember: new FormControl({ value: false, disabled: false })
    });

    const isLogged = this.store.selectSnapshot(AuthStoreState.getIsLogged);

    if (isLogged) {
      this.router.navigate([this.configService.getAppRoute('APP_DASHBOARD')]);
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loader.clear();
  }

  protected onClickSignIn(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.loader.start('login');

    this.addSubscription(
      this.authService
        .login(this.loginForm.getRawValue())
        .pipe(take(1))
        .subscribe({
          next: (data: boolean) => {
            if (data) {
              this.loader.stop('login');

              this.messageService.add({
                key: 'app-layout-message-box',
                severity: 'success',
                summary: this.translate.instant(
                  _i18n('layout.message.confirmation.successHeader')
                ),
                detail: this.translate.instant(
                  _i18n('login.confirmation.successDetail')
                )
              });

              setTimeout(() => {
                this.authService.dispatchLoginOk();
              }, 0);
            }
          },
          error: (error) => this.handleError(error)
        })
    );
  }

  protected onClickForgotPassword(): void {
    this.router.navigate([
      this.configService.getAppRoute('AUTH_RESET_PASSWORD_REQUEST')
    ]);
  }
}
