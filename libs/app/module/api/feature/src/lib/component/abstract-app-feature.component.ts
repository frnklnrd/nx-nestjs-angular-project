/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { AbstractFeatureComponent } from '@project/app-core-api';
import { FlowUtilService } from '@project/app-core-util-flow';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-abstract-app-feature',
  template: ''
})
export abstract class AbstractAppFeatureComponent
  extends AbstractFeatureComponent
  implements OnInit, OnChanges, OnDestroy
{
  // ---------------------------------------------------------------------

  protected readonly messageService: MessageService =
    inject<MessageService>(MessageService);

  protected readonly confirmationService: ConfirmationService =
    inject<ConfirmationService>(ConfirmationService);

  protected readonly dialogService: DialogService =
    inject<DialogService>(DialogService);

  // ---------------------------------------------------------------------

  protected readonly flow: FlowUtilService =
    inject<FlowUtilService>(FlowUtilService);

  protected readonly router: Router = inject<Router>(Router);

  protected readonly route: ActivatedRoute =
    inject<ActivatedRoute>(ActivatedRoute);

  // ---------------------------------------------------------------------

  protected readonly datePipe: DatePipe = inject<DatePipe>(DatePipe);

  /*
  protected readonly systemLangs = inject<any>(I18N_LANGUAGES_CONFIG_TOKEN);

  protected currentLang = this.translate.currentLang;

  protected currentLangSettings = this.systemLangs[this.currentLang];
  */

  // ---------------------------------------------------------------------

  protected constructor() {
    super();
  }

  // ---------------------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();
    /*
    this.addSubscription(
      this.translate.onLangChange.subscribe((lang) => {
        this.currentLang = lang.lang;
        this.currentLangSettings = this.systemLangs[lang.lang];
      })
    );
    */
  }

  // ---------------------------------------------------------------------

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ---------------------------------------------------------------------

  protected handleError(error: any): void {
    this.logger.console.error('ERROR HANDLED: ', error);
    this.loader.clear();
    this.messageService.add({
      key: 'app-main-layout-message-box',
      severity: 'error',
      summary: this.translate.instant(
        _i18n('layout.message.confirmation.errorHeader')
      ),
      detail: error
    });
    return;
  }

  // ---------------------------------------------------------------------

  @HostListener('window:sidebar-action:' + 'app:navigate-to', ['$event'])
  navigateToPathListener($event: CustomEvent): void {
    if (!$event.detail.path) {
      return;
    }
    this.router.navigate(
      [
        this.configService.getAppRoute($event.detail.path),
        ...(Array.isArray($event.detail.pathExtras)
          ? $event.detail.pathExtras
          : $event.detail.pathExtras
          ? [$event.detail.pathExtras]
          : [])
      ],
      {
        queryParams: $event.detail.pathQueryParams
      }
    );
  }

  @HostListener('window:sidebar-action:' + 'app:navigate-to-or-backward', [
    '$event'
  ])
  navigateToPathOrBackwardListener($event: any) {
    if ($event.detail.path) {
      this.router.navigate(
        [
          this.configService.getAppRoute($event.detail.path),
          ...(Array.isArray($event.detail.pathExtras)
            ? $event.detail.pathExtras
            : $event.detail.pathExtras
            ? [$event.detail.pathExtras]
            : [])
        ],
        {
          queryParams: $event.detail.pathQueryParams
        }
      );
      return;
    }
    if (this.flow.lastRouteValue) {
      this.router.navigate([this.flow.lastRouteValue]);
    } else {
      this.navigateToPathListener($event);
    }
  }

  // ---------------------------------------------------------------------

  protected mapToIds(items: any[], fieldName = 'id'): any[] {
    return items.map((item) => item[fieldName]);
  }

  protected filterMasterElementByKey(
    masterList: any[],
    key: keyof any,
    value: string
  ): any[] {
    return masterList.filter(
      (element: any) =>
        Object.prototype.hasOwnProperty.call(element, key) &&
        element[key] === value
    );
  }

  // ---------------------------------------------------------------------
}
