import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { AuthCoreService } from '@project/app-core-auth-service';
import { MenuItem } from 'primeng/api';
import { take } from 'rxjs';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];

  menu1Items: MenuItem[] = [];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  protected authService: AuthCoreService =
    inject<AuthCoreService>(AuthCoreService);

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    this.menu1Items = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-fw pi-cog'
          },
          {
            label: 'Billing',
            icon: 'pi pi-fw pi-file'
          }
        ]
      },
      { separator: true },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          this.authService
            .logout()
            .pipe(take(1))
            .subscribe(() => {
              this.authService.dispatchLogoutOk();
            });
        }
      }
    ];
  }
}
