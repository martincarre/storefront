import { Injectable, signal } from '@angular/core';
import { NavItem } from './navbar/nav-item/nav-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  readonly navTopItems = signal<NavItem[]>([
    {
      tooltip: 'Home',
      icon: 'home',
      route: 'home',
      subItems: [
        {
          tooltip: 'Dashboard',
          icon: 'dashboard',
          route: 'dashboard'
        },
        {
          tooltip: 'Messages',
          icon: 'message',
          route: 'messages'
        }
      ]
    },
    {
      tooltip: 'About',
      icon: 'info',
      route: 'about',
      subItems: [
        {
          tooltip: 'Company',
          icon: 'business',
          route: 'company'
        },
        {
          tooltip: 'Team',
          icon: 'group',
          route: 'team'
        }
      ]
    },
    {
      tooltip: 'Contact',
      icon: 'email',
      route: 'contact'
    }
  ]);

  readonly navBottomItems = signal<NavItem[]>([
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
  ]);

  getNavBottomItems(): NavItem[] {
    return this.navBottomItems();
  };

  getNavTopItems(): NavItem[] {
    return this.navTopItems();
  }

}
