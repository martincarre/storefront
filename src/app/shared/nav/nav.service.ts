import { inject, Injectable, Signal, signal } from '@angular/core';
import { NavItem } from './navbar/nav-item/nav-item.model';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/user-role.interface';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private authService = inject<AuthService>(AuthService);
  private navTopItemsInit = signal<NavItem[]>([
    {
      tooltip: 'Home',
      icon: 'home',
      route: 'home',
      requiredRoles: [UserRole.Guest]
    },
    {
      tooltip: 'Products',
      icon: 'stream',
      route: 'products',
      subItems: [
        {
          tooltip: 'Google Maps Finder',
          icon: 'pin_drop',
          route: 'products/gm-finder',
          requiredRoles: [UserRole.Guest]
        },
        {
          tooltip: 'Company Information',
          icon: 'find_in_page',
          route: 'products/company-info',
          requiredRoles: [UserRole.Guest]
        }
      ],
      requiredRoles: [UserRole.Guest]
    },
    {
      tooltip: 'Google Maps Finder',
      icon: 'pin_drop',
      route: 'gm-finder',
      coloredIcon: true,
      subItems: [
        {
          tooltip: 'Dashboard',
          icon: 'dashboard',
          route: 'gm-finder/dashboard',
          requiredRoles: [UserRole.Admin, UserRole.User, UserRole.Moderator],
        },
        {
          tooltip: 'Search',
          icon: 'search',
          route: 'gm-finder/search',
          requiredRoles: [UserRole.Admin, UserRole.User, UserRole.Moderator],
        },
        {
          tooltip: 'Previous Results',
          icon: 'list',
          route: 'gm-finder/results',
          requiredRoles: [UserRole.Admin, UserRole.User, UserRole.Moderator],
        },
      ],
      requiredRoles: [UserRole.Admin, UserRole.User, UserRole.Moderator],
    },
    {
      tooltip: 'News',
      icon: 'article',
      route: 'news',
      requiredRoles: [UserRole.Guest, UserRole.User]
    }
  ]);
  private navBottomItemsInit = signal<NavItem[]>([
    {
      tooltip: 'Pricing',
      icon: 'sell',
      route: 'pricing',
      requiredRoles: [UserRole.Guest]
    },
    {
      tooltip: 'Login',
      icon: 'login',
      route: 'user/login',
      requiredRoles: [UserRole.Guest]
    },
    {
      tooltip: 'Sign up',
      icon: 'rocket_launch',
      route: 'user/signup',
      coloredIcon: true,
      requiredRoles: [UserRole.Guest]
    },
    {
      tooltip: 'Settings',
      icon: 'person',
      route: 'user/settings',
      coloredIcon: true,
      requiredRoles: [UserRole.Admin, UserRole.User, UserRole.Moderator]
    },
    {
      tooltip: 'Logout',
      icon: 'logout',
      route: 'logout',
      onClickAction: () => {
        this.authService.logout();
      },
      requiredRoles: [UserRole.Admin, UserRole.User, UserRole.Moderator]
    }
  ]);

  navBottomItems = this.navBottomItemsInit.asReadonly();
  navTopItems = this.navTopItemsInit.asReadonly();

}
