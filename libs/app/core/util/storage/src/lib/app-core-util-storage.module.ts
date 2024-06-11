import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StorageUtilService } from './service/storage-util.service';

@NgModule({
  imports: [CommonModule],
  providers: [StorageUtilService]
})
export class AppCoreUtilStorageModule {}
