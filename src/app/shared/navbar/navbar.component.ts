import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatListItem, MatListModule} from '@angular/material/list';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavModule } from './nav.module';
import { NavItem } from './nav-item/nav-item.model';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, NavModule, NavItemComponent ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
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

  navBottomItems: NavItem[] = [];

}
