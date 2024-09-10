// import { inject, Injectable, signal } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { AuthedUser } from './authed-user.interface';
// import { Router } from '@angular/router';
// import { mockAuthUsers } from '../../user/mock-users';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private router = inject(Router);
//   private aUser = signal<AuthedUser | null>(null);
//   private _snackbar = inject(MatSnackBar);
//   authedUser = this.aUser.asReadonly();

//   signup(signupData: any) {
//     const isAuthedUser = this.authedUserHandler();
//     if (isAuthedUser) {
//       return;
//     }
//     console.log('Signup data:', signupData);
//   }

//   login(email: string, password: string) {
//     const isAuthedUser = this.authedUserHandler();
//     if (isAuthedUser) {
//       console.log(this.aUser());
//       return;
//     }
//     const foundUser = mockAuthUsers.find(user => user.email === email);
//     if (!foundUser) {
//       alert('User not found. Please sign up.');
//       this.router.navigate(['/user/signup']);
//       return;
//     } else {
//       this.aUser.set(foundUser);
//       this._snackbar.open(`Login successful! Welcome ${this.aUser()?.name}.`, 'Close', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
//       console.log('Login:', this.aUser());
//     }
//   }

//   logout() {
//     this.aUser.set(null);
//     this.router.navigate(['/']);
//     this._snackbar.open('Loggout successful! See you later...', 'Close', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
//     console.log('Logout: ', this.aUser());
//   }

//   authedUserHandler(): boolean { 
//     if (this.aUser()) {
//       this._snackbar.open('User already signed in. You can\'t perform this action again... Try logging out first.', 'Close', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
//       this.router.navigate(['/']);
//       return true;
//     } else {
//       return false;
//     }
//   }
// }

import { isPlatformBrowser } from '@angular/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, User, UserCredential, signOut, Auth, connectAuthEmulator } from 'firebase/auth';

import { environment } from '../../../environments/environment';
import { AuthedUser } from './authed-user.interface';
import { UserRole } from './user-role.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private platformId = inject(PLATFORM_ID);

  private aUser = signal<AuthedUser | null>(null); //TODO: Replace any with a proper type
  authedUser = this.aUser.asReadonly();


  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.app = initializeApp(environment.firebaseConfig);
      this.auth = getAuth(this.app);
    }
    if (environment.useEmulators && this.auth) {
      connectAuthEmulator(this.auth, environment.emulators.auth.url!); // Forcing non-null assertion because I know I'm in dev mode and not using the prod env file.
      console.log('Connected to Firebase Auth Emulator');
    } else {
      console.log('Using production Firebase Auth');
    }
    if (!this.app) {
      throw new Error('Firebase app not initialized');
    }
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth!, email, password)
      .then((userCredential: UserCredential) => {
        if (!userCredential.user) {
          throw new Error('User not found');
        } else if (userCredential.user) {
          const resUser: User = userCredential.user;
          const resAuthedUser: AuthedUser = { 
            email: resUser.email ? resUser.email : 'Anonymous',
            name: resUser.displayName ? resUser.displayName : 'Anonymous',
            isVerified: resUser.emailVerified,
            roles: [UserRole.Admin]
          }
          // TODO: transform userCredential.user to AuthedUser
          this.aUser.set(resAuthedUser);
          console.log('User:', this.aUser());
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  logout(): void {
    this.auth ? signOut(this.auth) : this.firebaseInitError();
    this.aUser.set(null);
  }

  signup(signupData: any) {
    console.log('Signup data:', signupData);
  }

  firebaseInitError() {
    console.error('Firebase app not initialized');
  }
}
