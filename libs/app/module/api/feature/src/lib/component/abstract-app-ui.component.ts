/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { AbstractComponent } from '@project/app-core-api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-abstract-app',
  template: ''
})
export abstract class AbstractAppUiComponent
  extends AbstractComponent
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

  protected readonly datePipe: DatePipe = inject<DatePipe>(DatePipe);

  /*
  protected readonly systemLangs = inject<any>(I18N_LANGUAGES_CONFIG_TOKEN);

  protected currentLang = this.translate.currentLang;

  protected currentLangSettings = this.systemLangs[this.currentLang];

  @Input() moduleName!: string;

  moduleId!: string;
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
      key: 'app-layout-message-box',
      severity: 'error',
      summary: this.translate.instant(
        _i18n('layout.message.confirmation.errorHeader')
      ),
      detail: error
    });
    return;
  }

  // ---------------------------------------------------------------------

  protected mapToIds(items: any[], fieldName = 'id'): any[] {
    return items.map((item) => item[fieldName]);
  }

  // ---------------------------------------------------------------------
}
