/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  CachedSetKeyDataStoreAction,
  CachedStoreState
} from '@project/app-core-util-cached';
import { AbstractAppFeatureComponent } from './abstract-app-feature.component';

@Component({
  selector: 'app-abstract-app-detail-feature',
  template: ''
})
export abstract class AbstractAppDetailFeatureComponent<T>
  extends AbstractAppFeatureComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  //-------------------------------------------------------------

  @Input() id!: string;

  //-------------------------------------------------------------

  itemDetailData: T | any | undefined = {};

  //-------------------------------------------------------------

  activeIndex = 0;

  //-------------------------------------------------------------

  tabsIndexes: any = {
    generals: 0
  };

  //-------------------------------------------------------------

  alertMsgs: any[] = [];

  //-------------------------------------------------------------

  protected abstract getItemName(): string;

  override ngOnInit() {
    super.ngOnInit();

    const activeTab = this.route.snapshot.queryParamMap.get('activeTab');

    if (activeTab) {
      this.activeIndex = this.tabsIndexes[activeTab ? activeTab : 'generals'];
    } else {
      const cachedActiveIndex = this.store.selectSnapshot(
        CachedStoreState.getSearchCachedSelector('item-file-tab-active-index')
      );
      this.activeIndex = cachedActiveIndex[this.getItemName() + '-' + this.id]
        ?.activeIndex
        ? cachedActiveIndex[this.getItemName() + '-' + this.id]?.activeIndex
        : this.tabsIndexes['generals'];
    }
  }

  //-------------------------------------------------------------

  onActiveTabIndexChange($event: any): void {
    const cachedActiveIndex = this.store.selectSnapshot(
      CachedStoreState.getCachedSelector('item-file-tab-active-index')
    );
    this.store.dispatch(
      new CachedSetKeyDataStoreAction(
        'item-file-tab-active-index',
        Object.assign({}, cachedActiveIndex, {
          [this.getItemName() + '-' + this.id]: {
            activeIndex: this.activeIndex
          }
        })
      )
    );
  }

  //-------------------------------------------------------------
}
