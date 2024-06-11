/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  isDevMode,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigUtilService } from '@project/app-core-util-config';
import { LoaderUtilService } from '@project/app-core-util-loader';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  template: ''
})
export abstract class AbstractComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked
{
  // ---------------------------------------------------------------------

  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  protected readonly translate: TranslateService =
    inject<TranslateService>(TranslateService);

  protected readonly loader: LoaderUtilService =
    inject<LoaderUtilService>(LoaderUtilService);

  protected readonly loading$: Observable<boolean> =
    this.loader.getObservable();

  // ---------------------------------------------------------------------

  protected readonly __classname: string;

  protected readonly __isDevMode = isDevMode();

  // ---------------------------------------------------------------------

  protected readonly __subscriptions: Subscription = new Subscription();

  protected readonly destroy$: Subject<boolean> = new Subject();

  protected isFirstChange: boolean | null = null;

  // ---------------------------------------------------------------------

  @Output() init: EventEmitter<Component> = new EventEmitter<Component>();

  @Output() destroy: EventEmitter<Component> = new EventEmitter<Component>();

  // ---------------------------------------------------------------------

  protected constructor() {
    this.__classname = this.constructor.name;
  }

  // ---------------------------------------------------------------------

  ngOnInit(): void {
    this.logger.console.debug(this.__classname, 'ngOnInit');
    this.onInitStart();
    this.onInitAndOnChangeLanguage();
    this.addSubscription(
      this.translate.onLangChange.subscribe(() => {
        this.onChangeLanguage();
        this.onInitAndOnChangeLanguage();
      })
    );
    this.onInitEnd();
    this.init.emit(this as Component);
  }

  // ---------------------------------------------------------------------

  ngOnDestroy(): void {
    this.logger.console.debug(this.__classname, 'ngOnDestroy');
    this.__subscriptions.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy.emit(this as Component);
  }

  // ---------------------------------------------------------------------

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.console.debug(this.__classname, 'ngOnChanges');
    if (this.isFirstChange === null) {
      this.isFirstChange = true;
    } else if (this.isFirstChange === true) {
      this.isFirstChange = false;
    }
  }

  // ---------------------------------------------------------------------

  ngAfterViewInit(): void {
    //
  }

  // ---------------------------------------------------------------------

  ngAfterViewChecked(): void {
    //
  }

  // ---------------------------------------------------------------------

  protected onInitStart(): void {
    this.logger.console.debug(this.__classname, 'onInitStart');
    //
  }

  protected onChangeLanguage(): void {
    this.logger.console.debug(this.__classname, 'onChangeLanguage');
    //
  }

  protected onInitAndOnChangeLanguage(): void {
    this.logger.console.debug(this.__classname, 'onInitAndOnChangeLanguage');
    //
  }

  protected onInitEnd(): void {
    this.logger.console.debug(this.__classname, 'onInitEnd');
    //
  }

  // ---------------------------------------------------------------------

  protected addSubscription(subscription?: Subscription): Subscription {
    this.logger.console.debug(this.__classname, 'addSubscription');
    if (subscription) {
      this.__subscriptions.add(subscription);
    }
    return subscription as Subscription;
  }

  // ---------------------------------------------------------------------
}
