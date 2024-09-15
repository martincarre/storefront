import { afterNextRender, Directive, effect, inject, input, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from './user-role.interface';
import { AuthedUser } from './authed-user.interface';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private isViewRendered = false;

  private currentUserRoles: UserRole[] = [];
  requiredRoles = input.required<UserRole[]>({ alias: 'appHasRole' });
  
  // FIXME: Need to work on this. It's not working properly.
  constructor() {
    effect(() => {
      if (this.authService.authedUser()) {
        this.currentUserRoles = (this.authService.authedUser() as AuthedUser).roles;
      } else {
        this.currentUserRoles = [UserRole.Guest];
      }
      this.updateView();
    })
  }

  private updateView(): void {
    // Check if the user has any of the required roles
    const hasRequiredRole = this.requiredRoles().some(role => this.currentUserRoles.includes(role));

    if (hasRequiredRole && !this.isViewRendered) {
      // If user has the required role and view is not rendered, render the view
      this.viewContainer.clear();  // Clear any existing view
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isViewRendered = true;  // Mark the view as rendered
    } else if (!hasRequiredRole && this.isViewRendered) {
      // If user doesn't have the required role and the view is rendered, clear the view
      this.viewContainer.clear();
      this.isViewRendered = false;  // Mark the view as not rendered
    }
  }
}
