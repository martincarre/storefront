import { Component, inject, output } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavModule } from '../nav.module';
import { NavItem } from './nav-item/nav-item.model';
import { NavEvent } from './nav-event.item';
import { NavService } from '../nav.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, NavModule, NavItemComponent ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navClick = output<NavEvent>();
  private navService = inject<NavService>(NavService);
  navBottomItems = this.navService.getNavBottomItems();
  navTopItems = this.navService.getNavTopItems();

  toggleSidenav(inputType: string, navItem: NavItem) {
    const navEvent: NavEvent = {
      type: inputType,
      label: navItem.tooltip,
      route: navItem.route,
      subItems: navItem.subItems
    }
    this.navClick.emit(navEvent);
  }


}
