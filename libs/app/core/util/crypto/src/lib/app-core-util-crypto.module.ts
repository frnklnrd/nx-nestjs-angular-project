import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CryptoUtilService } from './service/crypto-util.service';

@NgModule({
  imports: [CommonModule],
  providers: [CryptoUtilService]
})
export class AppCoreUtilCryptoModule {}
