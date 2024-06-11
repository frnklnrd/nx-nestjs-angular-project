import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TranslateModule } from '@ngx-translate/core';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DialogService } from 'primeng/dynamicdialog';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: true,
    leadZeroDateTime: true,
    dropSpecialCharacters: false
  };
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    // -----------------------
    FormsModule,
    ReactiveFormsModule,
    // -----------------------
    HttpClientModule,
    // -----------------------
    TranslateModule,
    // -----------------------
    NgxMaskDirective,
    // -----------------------
    NgxLoadingModule
    // -----------------------
  ],
  providers: [
    // --------------------------------------------
    provideNgxMask(maskConfigFunction),
    // --------------------------------------------
    DatePipe,
    // --------------------------------------------
    DialogService,
    MessageService,
    ConfirmationService
    // --------------------------------------------
  ]
})
export class AppCoreConfigModule {}
