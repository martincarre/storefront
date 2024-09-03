import { Component, inject, input, output } from '@angular/core';
import { NavItem } from '../navbar/nav-item/nav-item.model';
import { NavModule } from '../nav.module';
// import { EventEmitter } from 'stream';

@Component({
  selector: 'app-sub-sidenav',
  standalone: true,
  imports: [NavModule],
  templateUrl: './sub-sidenav.component.html',
  styleUrl: './sub-sidenav.component.scss'
})
export class SubSidenavComponent {
  navItems = input.required<NavItem[] | undefined | null>();
  title = input.required<string | undefined>();
  closeOnSelect = output<boolean>();

  onSelect(navItem: NavItem) {
    console.log(navItem);
    this.closeOnSelect.emit(true);
  }
}
