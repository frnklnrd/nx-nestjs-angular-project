/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FlowUtilService {
  private static readonly __current$ = new BehaviorSubject<any>(null as any);

  private static readonly __last$ = new BehaviorSubject<any>(null as any);

  get currentRoute$() {
    return FlowUtilService.__current$.asObservable();
  }

  get currentRouteValue() {
    return FlowUtilService.__current$.getValue();
  }

  get lastRoute$() {
    return FlowUtilService.__last$.asObservable();
  }

  get lastRouteValue() {
    return FlowUtilService.__last$.getValue();
  }

  saveCurrentRoute(urlAfterRedirects: any) {
    FlowUtilService.__current$.next(urlAfterRedirects);
  }

  saveLastRoute(urlAfterRedirects: any) {
    FlowUtilService.__last$.next(urlAfterRedirects);
  }
}
