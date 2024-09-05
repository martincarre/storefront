import { Directive, effect, inject, Input, Signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from './user-role.interface';
import { AuthedUser } from './authed-user.interface';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private currentUserRoles: UserRole[] = [];
  private isLoggedIn: boolean = false;
  private requiredRoles: UserRole[] = [];
  
  // FIXME: Need to work on this. It's not working properly.
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
    effect(() => {
      const authedUser: Signal<AuthedUser | null> = this.authService.getAuthedUser();
      const authedUserValue = authedUser();
      this.isLoggedIn = authedUserValue !== null;
      if (authedUserValue) {
        this.currentUserRoles = authedUserValue.roles;
      }
      this.updateView();
    })
  }
  
  @Input('appHasRole') set appHasRoles(roles: UserRole[]) {
    this.requiredRoles = roles;
    this.updateView();
  }

  private updateView(): void {
    console.log('Current user roles:', this.currentUserRoles);
    this.viewContainer.clear();
    if (this.isLoggedIn && this.requiredRoles.some(role => this.currentUserRoles.includes(role))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
