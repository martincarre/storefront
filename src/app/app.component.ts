import { afterNextRender, afterRender, AfterViewInit, Component, HostListener, inject, PLATFORM_ID, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SubSidenavComponent } from "./shared/nav/sub-sidenav/sub-sidenav.component";
import { NavEvent } from './shared/nav/navbar/nav-event.item';
import { isPlatformBrowser, JsonPipe, NgClass, NgStyle } from '@angular/common';
import { SpinnerComponent } from "./shared/spinner/spinner/spinner.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NgClass,
    NgStyle,
    NavbarComponent, 
    MatSidenavModule, 
    SubSidenavComponent, 
    JsonPipe, 
    SpinnerComponent, 
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'storefront';
  private platformId = inject(PLATFORM_ID);

  // Signals for navbar and sidenav state
  navBarOpened = signal<boolean>(false);
  mobileView = signal<boolean>(false);
  sideNavOpened = signal<boolean>(false);
  currOpenedItem = signal<NavEvent | null>(null);

  sideNav = viewChild<MatSidenav>(MatSidenav);

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobileView.set(window.innerWidth < 768);
    if (this.mobileView()) {
      this.navBarOpened.set(false);
    } else {
      this.navBarOpened.set(true);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileView();
    }
  }

  checkMobileView(): void {
    const isMobile = window.innerWidth < 768;
    this.mobileView.set(isMobile);
    this.navBarOpened.set(!isMobile);  // Toggle navbar based on view
  }


  // Toggle navbar visibility
  toggleNavBar() {
    this.navBarOpened.set(!this.navBarOpened());
    if (this.sideNavOpened()) {
      this.closeSidenav();
    }
  }

  // Apply dynamic container classes based on mobile view and navbar state
  getContainerClass() {
    if (this.mobileView()) {
      return this.navBarOpened() ? 'mobile-container-nav-open' : 'mobile-container-nav-closed';
    } else {
      return 'base-container';
    }
  }

  // Handle sidenav toggle based on nav item click event
  sideNavToggle(navEvent: NavEvent) {
    if (navEvent.type === 'click') {
      if (navEvent.subItems) {
        if (navEvent.label === this.currOpenedItem()?.label) {
          this.sideNavOpened.set(!this.sideNavOpened());
        } else {
          this.currOpenedItem.set(navEvent);
          this.sideNavOpened.set(true);
        }
      } else {
        this.currOpenedItem.set(navEvent);
        this.sideNavOpened.set(false);
      }
    }
  }

  // Close sidenav and reset state
  closeSidenav() {
    this.sideNavOpened.set(false);
    this.currOpenedItem.set(null);
    this.sideNav()!.close();
  }
}