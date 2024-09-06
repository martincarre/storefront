import { Directive, effect, inject, input, Input, TemplateRef, ViewContainerRef } from '@angular/core';
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
    if (this.requiredRoles().some(role => this.currentUserRoles.includes(role))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
