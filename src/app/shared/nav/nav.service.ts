import { inject, Injectable, signal } from '@angular/core';
import { NavItem } from './navbar/nav-item/nav-item.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private authService = inject<AuthService>(AuthService);
  readonly navTopItems = signal<NavItem[]>([
    {
      tooltip: 'Home',
      icon: 'home',
      route: 'home',
    },
    {
      tooltip: 'Products',
      icon: 'stream',
      route: 'products',
      subItems: [
        {
          tooltip: 'Google Maps Finder',
          icon: 'pin_drop',
          route: 'products/gm-finder'
        },
        {
          tooltip: 'Company Information',
          icon: 'find_in_page',
          route: 'products/company-info'
        }
      ]
    },
    {
      tooltip: 'Google Maps Finder',
      icon: 'pin_drop',
      route: 'gm-finder'
    }
  ]);

  readonly navBottomItems = signal<NavItem[]>([
    {
      tooltip: 'Pricing',
      icon: 'sell',
      route: 'pricing'
    },
    {
      tooltip: 'Login',
      icon: 'login',
      route: 'user/login'
    },
    {
      tooltip: 'Sign up',
      icon: 'rocket_launch',
      route: 'user/signup',
      coloredIcon: true,
    },
    {
      tooltip: 'Settings',
      icon: 'person',
      route: 'user/settings',
      coloredIcon: true
    },
    {
      tooltip: 'Logout',
      icon: 'logout',
      route: 'logout',
      onClickAction: () => {
        this.authService.logout();
      }
    }
  ]);

  getNavBottomItems(): NavItem[] {
    return this.navBottomItems();
  };

  getNavTopItems(): NavItem[] {
    return this.navTopItems();
  }

}
