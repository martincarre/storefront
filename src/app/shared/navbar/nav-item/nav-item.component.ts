import { Component, input } from '@angular/core';
import { NavItem } from './nav-item.model';
import { NavModule } from '../nav.module';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [ NavModule ],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss'
})
export class NavItemComponent {
  navItem = input.required<NavItem>();

}
