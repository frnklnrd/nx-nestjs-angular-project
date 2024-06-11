import { Component, OnInit, inject } from '@angular/core';
import { LoaderUtilService } from '@project/app-core-util-loader';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { AppConfig, LayoutService } from './layout/service/app.layout.service';
import { ThemeNamesEnum } from './theme/theme.names.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected readonly loader: LoaderUtilService =
    inject<LoaderUtilService>(LoaderUtilService);

  protected readonly loading$: Observable<boolean> =
    this.loader.getObservable();

  constructor(
    private primengConfig: PrimeNGConfig,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    // this.primengConfig.ripple = true;

    //optional configuration with the default configuration
    const config: AppConfig = {
      ripple: true, // toggles ripple on and off
      inputStyle: 'filled', // 'outlined', // default style for input elements
      menuMode: 'static', // layout mode of the menu, valid values are "static" and "overlay"
      colorScheme: 'light', // color scheme of the template, valid values are "light" and "dark"
      theme: ThemeNamesEnum.MIRA, // default component theme for PrimeNG
      scale: 14 // size of the body font size to scale the whole application
    };
    this.layoutService.config.set(config);
  }
}
