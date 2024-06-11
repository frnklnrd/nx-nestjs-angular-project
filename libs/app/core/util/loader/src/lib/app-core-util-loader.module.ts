import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingFilterPipe } from './pipe/loading-filter.pipe';
import { LoaderUtilService } from './service/loader-util.service';

@NgModule({
  imports: [CommonModule, LoadingFilterPipe],
  providers: [LoaderUtilService],
  exports: [LoadingFilterPipe]
})
export class AppCoreUtilLoaderModule {}
