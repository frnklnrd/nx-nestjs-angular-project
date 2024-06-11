/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractAppFeatureComponent } from './abstract-app-feature.component';

@Component({
  selector: 'app-abstract-app-add-edit-feature',
  template: ''
})
export abstract class AbstractAppAddEditFeatureComponent<T>
  extends AbstractAppFeatureComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  //--------------------------------------------------------------

  @Input() id!: string;

  //-------------------------------------------------------------

  itemAddEditForm!: FormGroup;

  itemAddEditData: T | any | undefined;

  dialogForm!: FormGroup;

  //-------------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();

    this.itemAddEditForm.markAllAsTouched();
  }
  //-------------------------------------------------------------
}
