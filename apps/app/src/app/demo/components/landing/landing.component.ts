import { Component } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/app/src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  constructor(public layoutService: LayoutService, public router: Router) {}
}
