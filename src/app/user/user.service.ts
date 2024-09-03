import { inject, Injectable, signal} from '@angular/core';
import { AuthedUser } from './user.interface';
import { Router } from '@angular/router';
import { mockAuthUsers } from './mock-users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private router = inject(Router);
  private aUser = signal<AuthedUser | null>(null);

  // TODO: Might have to set this user here in the constructor. Not sure...
  constructor() {
    
  }

  getAuthedUser() {
    
  }

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
      console.log('Login:', this.aUser());
    }
  }

  logout() {
    this.aUser.set(null);
    this.router.navigate(['/']);
    console.log('Logout: ', this.aUser());
  }

  authedUserHandler(): boolean { 
    if (this.aUser()) {
      alert('User already signed in. You can\'t perform this action again... Try logging out first.');
      this.router.navigate(['/']);
      return true;
    } else {
      return false;
    }
  }
}
