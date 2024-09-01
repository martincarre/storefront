import { Component, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SubSidenavComponent } from "./shared/sub-sidenav/sub-sidenav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MatSidenavModule, SubSidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'storefront';
  opened = signal<boolean>(false);

  
  sideNavToggle(inputType: string) {
    if (inputType ===  'click') {
      this.opened.set(!this.opened());
      console.log(this.opened());
    }
  }
}
