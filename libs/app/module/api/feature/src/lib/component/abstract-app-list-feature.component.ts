/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  CachedSetKeyDataStoreAction,
  CachedStoreState
} from '@project/app-core-util-cached';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Observable, take } from 'rxjs';
import { AbstractAppFeatureComponent } from './abstract-app-feature.component';

@Component({
  selector: 'app-abstract-app-list-feature',
  template: ''
})
export abstract class AbstractAppListFeatureComponent<T, S>
  extends AbstractAppFeatureComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  //-------------------------------------------------------------

  items: T[] = [];

  selectedItem!: T;

  totalRecords = 0;

  clearGlobalFilterShow = false;

  searchCriteria: S = CachedStoreState.getDefaultSearchData() as S;

  //-------------------------------------------------------------

  @ViewChild('filtersTable') __filtersTable!: Table;

  @ViewChild('itemsTable') __itemsTable!: Table;

  //-------------------------------------------------------------

  constructor() {
    super();
  }

  //-------------------------------------------------------------

  override ngOnInit() {
    this.addSubscription(
      this.store
        .select(
          CachedStoreState.getSearchCachedSelector(
            this.getItemsName() + '-search-criteria'
          )
        )
        .subscribe((data) => {
          this.searchCriteria = Object.assign(
            {},
            this.searchCriteria ? this.searchCriteria : {},
            JSON.parse(JSON.stringify(data))
          );
        })
    );

    super.ngOnInit();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateFiltersInDataTables();
  }

  //-------------------------------------------------------------

  protected abstract getItemRequest(searchCriteria: S): Observable<any>;

  protected abstract goToItemAdd(): void;

  protected abstract goToItemEdit(item: T): void;

  protected abstract goToItemDetail(item: T): void;

  protected abstract getItemsName(): string;

  //-------------------------------------------------------------

  protected loadItemsData(event: TableLazyLoadEvent) {
    this.loader.start('loading-data-' + this.getItemsName());

    this.processFiltersData(event);

    this.addSubscription(
      this.getItemRequest(this.searchCriteria)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            this.loader.stop('loading-data-' + this.getItemsName());
            this.onSearchResultSuccess(data);
          },
          error: (error: any) => {
            this.loader.stop('loading-data-' + this.getItemsName());
            this.onSearchResultError(error);
            this.handleError(error);
          }
        })
    );
  }

  protected onSearchResultSuccess(data: any): void {
    this.items = data.items;
    this.totalRecords = data.totalElements;
    (this.searchCriteria as any).page = data.page;
  }

  protected onSearchResultError(error: any): void {
    this.items = [];
  }

  //-------------------------------------------------------------

  protected cleanAdvancedFilters(): void {
    if (this.__filtersTable) {
      this.__filtersTable.clearFilterValues();
    }

    if (this.__itemsTable) {
      this.__itemsTable.clearFilterValues();
    }

    const cleanedFilters = {};

    Object.keys(this.searchCriteria as any).forEach((key) => {
      (cleanedFilters as any)[key] = null;
    });

    this.searchCriteria = Object.assign(
      {},
      cleanedFilters,
      CachedStoreState.getDefaultSearchData()
    ) as any;

    this.processFiltersData({
      showAdvancedSearchFilters: false
    });

    this.loadItemsData({});
  }

  protected toggleAdvancedFilters(show: boolean): void {
    this.processFiltersData({
      showAdvancedSearchFilters: show === true
    });
  }

  private processFiltersData(event: TableLazyLoadEvent | any) {
    this.updateSearchCriteria(event);

    if (event.showAdvancedSearchFilters === true) {
      (this.searchCriteria as any).showAdvancedSearchFilters = true;
    }

    if (event.showAdvancedSearchFilters === false) {
      (this.searchCriteria as any).showAdvancedSearchFilters = false;
    }

    this.store.dispatch(
      new CachedSetKeyDataStoreAction(
        this.getItemsName() + '-search-criteria',
        this.searchCriteria
      )
    );

    this.updateFiltersInDataTables();
  }

  private updateFiltersInDataTables(): void {
    setTimeout(() => {
      if (this.__filtersTable) {
        Object.keys(this.__filtersTable.filters).forEach((filterKey) => {
          if ((this.searchCriteria as any)[filterKey]?.op) {
            (this.__filtersTable.filters[filterKey] as any).value = (
              this.searchCriteria as any
            )[filterKey].value
              ? (this.searchCriteria as any)[filterKey].value
              : null;
          } else {
            (this.__filtersTable.filters[filterKey] as any).value = (
              this.searchCriteria as any
            )[filterKey]
              ? (this.searchCriteria as any)[filterKey]
              : null;
          }
        });
      }
      if (this.__itemsTable) {
        Object.keys(this.__itemsTable.filters).forEach((filterKey) => {
          if ((this.searchCriteria as any)[filterKey]?.op) {
            (this.__itemsTable.filters[filterKey] as any).value = (
              this.searchCriteria as any
            )[filterKey].value
              ? (this.searchCriteria as any)[filterKey].value
              : null;
          } else {
            (this.__itemsTable.filters[filterKey] as any).value = (
              this.searchCriteria as any
            )[filterKey]
              ? (this.searchCriteria as any)[filterKey]
              : null;
          }
        });
      }
    }, 200);
  }

  protected updateSearchCriteria(event: TableLazyLoadEvent): void {
    (this.searchCriteria as any).orderBy = 'CREATION_DATE';

    if (event.sortField) {
      (this.searchCriteria as any).orderBy = this.getOrderByFieldFromSortEvent(
        event.sortField as string
      );
    }

    if (event.sortOrder) {
      switch (event.sortOrder) {
        case 1:
          (this.searchCriteria as any).sortOrder = 'ASC';
          break;
        case -1:
          (this.searchCriteria as any).sortOrder = 'DESC';
          break;
      }
    }

    if (event.filters) {
      this.updateFiltersFromFilterEvent(event.filters);
    }

    if (event.globalFilter) {
      (this.searchCriteria as any).globalFilter = event.globalFilter.toString();
    } else {
      (this.searchCriteria as any).globalFilter = undefined as any;
    }

    if (event.first !== undefined && event.first !== null && event.rows) {
      (this.searchCriteria as any).page =
        (event.first as any) / (event.rows as any);
      (this.searchCriteria as any).pageSize = event.rows;
    }
  }

  protected getOrderByFieldFromSortEvent(sortField: string): string {
    if (sortField) {
      return this.convertCamelCaseToSNake(sortField);
    }
    return 'CREATION_DATE';
  }

  protected updateFiltersFromFilterEvent(filters: any): void {
    Object.keys(filters).forEach((filterKey: string) => {
      this.updateRequestFromFilterName(filterKey, filters);
    });
  }

  protected convertCamelCaseToSNake(fieldName: string): string {
    return fieldName
      .replace(/[A-Z]/g, (letter) => `_${letter.toLocaleUpperCase()}`)
      .toLocaleUpperCase();
  }

  protected updateRequestFromFilterName(filterKey: string, filters: any): void {
    switch (filterKey) {
      case 'enabled':
        if (
          filters['enabled']?.value !== undefined &&
          filters['enabled']?.value !== null
        ) {
          (this.searchCriteria as any)['enabled'] = filters['enabled']?.value;
        } else {
          (this.searchCriteria as any)['enabled'] = undefined as any;
        }
        break;
      default:
        if (filterKey.endsWith('ID')) {
          if (filters[filterKey]?.value) {
            (this.searchCriteria as any)[filterKey] = filters[filterKey]?.value;
          } else {
            (this.searchCriteria as any)[filterKey] = undefined as any;
          }
        } else if (filterKey.endsWith('IDs')) {
          if (filters[filterKey]?.value) {
            (this.searchCriteria as any)[filterKey] = filters[filterKey]?.value;
          } else {
            (this.searchCriteria as any)[filterKey] = undefined as any;
          }
        } else if (filterKey.endsWith('ENUM')) {
          if (filters[filterKey]?.value) {
            (this.searchCriteria as any)[
              (filterKey + '$').replace('ENUM$', '')
            ] = filters[filterKey]?.value;
          } else {
            (this.searchCriteria as any)[
              (filterKey + '$').replace('ENUM$', '')
            ] = undefined as any;
          }
        } else {
          if (filters[filterKey]?.value) {
            (this.searchCriteria as any)[filterKey] = {
              op: filters[filterKey]?.matchMode,
              value: filters[filterKey]?.value
            };
          } else {
            (this.searchCriteria as any)[filterKey] = undefined as any;
          }
          // (this.searchCriteria as any)[filterKey + 'Value'] =
          //   filters[filterKey]?.value;
          // (this.searchCriteria as any)[filterKey + 'Op'] =
          //   filters[filterKey]?.matchMode;
        }
    }
  }

  //-------------------------------------------------------------

  protected onRowSelect(event: any) {
    //
  }

  protected onRowUnselect(event: any) {
    //
  }

  protected clear(table: Table) {
    table.defaultSortOrder = -1;
    table.clear();
  }

  //-------------------------------------------------------------
}
