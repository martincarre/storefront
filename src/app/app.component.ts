import { Component, inject, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SubSidenavComponent } from "./shared/nav/sub-sidenav/sub-sidenav.component";
import { NavEvent } from './shared/nav/navbar/nav-event.item';
import { NavService } from './shared/nav/nav.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MatSidenavModule, SubSidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'storefront';
  opened = signal<boolean>(false);
  currOpenedItem = signal<NavEvent | null>(null);
  private navService = inject<NavService>(NavService);
  sideNav = viewChild<MatSidenav>(MatSidenav);
  
  // TODO: Get the nav items from the nav service
  // TODO: Change the NavEvent type to a better one that might include the title?
  sideNavToggle(navEvent: NavEvent) {
    // TODO: Handle the "hover" event. if mouse hovers then open the sidenav if it leaves then close it (there's the tricky part)
    if (navEvent.type ===  'click') {
      if (navEvent.subItems) {
        switch (navEvent.label === this.currOpenedItem()?.label) {
          case true:
            this.opened.set(!this.opened());
            break;
          case false:
            this.currOpenedItem.set(navEvent);
            this.opened.set(true);
            break;
        }
      } else {
        this.currOpenedItem.set(navEvent);
        this.opened.set(false);
      }
      console.log(navEvent);
    }
  }

  closeSidenav() {
    this.opened.set(false);
    this.currOpenedItem.set(null);
    this.sideNav()!.close();
  }
}
