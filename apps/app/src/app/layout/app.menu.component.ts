import { Component, OnInit } from '@angular/core';
import { APP_MENU_MODEL } from './menu/app.menu.model';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = APP_MENU_MODEL;
  }
}
