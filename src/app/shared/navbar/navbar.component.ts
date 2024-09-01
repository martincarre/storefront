import { Component, output } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavModule } from './nav.module';
import { NavItem } from './nav-item/nav-item.model';
import { NavEvent } from './nav-event.item';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, NavModule, NavItemComponent ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navClick = output<NavEvent>();
  navTopItems: NavItem[] = [
    {
      tooltip: 'Home',
      icon: 'home',
      route: 'home'
    },
    {
      tooltip: 'About',
      icon: 'info',
      route: 'about'
    },
    {
      tooltip: 'Contact',
      icon: 'email',
      route: 'contact'
    }
  ];

  navBottomItems: NavItem[] = [
    {
      tooltip: 'Settings',
      icon: 'settings',
      route: 'settings'
    },
    {
      tooltip: 'Profile',
      icon: 'person',
      route: 'profile'
    },
    {
      tooltip: 'Help',
      icon: 'help',
      route: 'help'
    }
  ];

  toggleSidenav(inputType: string, navItem: NavItem) {
    const navEvent: NavEvent = {
      type: inputType,
      label: navItem.tooltip,
      route: navItem.route,
    }
    this.navClick.emit(navEvent);
  }


}
