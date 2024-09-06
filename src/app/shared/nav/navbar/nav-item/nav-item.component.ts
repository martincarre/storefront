import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NavItem } from './nav-item.model';
import { NavModule } from '../../nav.module';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [ NavModule, NgClass],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavItemComponent {
  navItem = input.required<NavItem>();
}
