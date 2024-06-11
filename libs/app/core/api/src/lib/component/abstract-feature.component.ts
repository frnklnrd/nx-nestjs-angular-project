/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject
} from '@angular/core';
import { Store } from '@ngxs/store';
import { AbstractComponent } from './abstract.component';

@Component({
  template: ''
})
export abstract class AbstractFeatureComponent
  extends AbstractComponent
  implements OnInit, OnChanges, OnDestroy
{
  // ---------------------------------------------------------------------

  protected readonly store: Store = inject<Store>(Store);

  // ---------------------------------------------------------------------

  protected constructor() {
    super();
  }

  // ---------------------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();
  }

  // ---------------------------------------------------------------------

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ---------------------------------------------------------------------

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }

  // ---------------------------------------------------------------------
}
