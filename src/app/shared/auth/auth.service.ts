import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthedUser } from './authed-user.interface';
import { Router } from '@angular/router';
import { mockAuthUsers } from '../../user/mock-users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private aUser = signal<AuthedUser | null>(null);
  private _snackbar = inject(MatSnackBar);
  authedUser = this.aUser.asReadonly();

  signup(signupData: any) {
    const isAuthedUser = this.authedUserHandler();
    if (isAuthedUser) {
      return;
    }
    console.log('Signup data:', signupData);
  }

  login(email: string, password: string) {
    const isAuthedUser = this.authedUserHandler();
    if (isAuthedUser) {
      console.log(this.aUser());
      return;
    }
    const foundUser = mockAuthUsers.find(user => user.email === email);
    if (!foundUser) {
      alert('User not found. Please sign up.');
      this.router.navigate(['/user/signup']);
      return;
    } else {
      this.aUser.set(foundUser);
      this._snackbar.open(`Login successful! Welcome ${this.aUser()?.name}.`, 'Close', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
      console.log('Login:', this.aUser());
    }
  }

  logout() {
    this.aUser.set(null);
    this.router.navigate(['/']);
    this._snackbar.open('Loggout successful! See you later...', 'Close', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
    console.log('Logout: ', this.aUser());
  }

  authedUserHandler(): boolean { 
    if (this.aUser()) {
      this._snackbar.open('User already signed in. You can\'t perform this action again... Try logging out first.', 'Close', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
      this.router.navigate(['/']);
      return true;
    } else {
      return false;
    }
  }
}
