import { isPlatformBrowser } from '@angular/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, User, UserCredential, signOut, Auth, connectAuthEmulator } from 'firebase/auth';

import { environment } from '../../../environments/environment';
import { AuthedUser } from './authed-user.interface';
import { UserRole } from './user-role.interface';

interface SignupInfo { 
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: string;
  useCase: string;
  businessWebsite: string;
  businessName: string;
  businessType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private platformId = inject(PLATFORM_ID);

  private aUser = signal<AuthedUser | null>(null);
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
      console.error('Firebase app not initialized');
    }
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth!, email, password)
      .then((userCredential: UserCredential) => {
        if (!userCredential.user) {
          console.error('No user found');
        } else if (userCredential.user) {
          const resUser: User = userCredential.user;
          const resAuthedUser: AuthedUser = { 
            email: resUser.email ? resUser.email : 'Anonymous',
            name: resUser.displayName ? resUser.displayName : 'Anonymous',
            isVerified: resUser.emailVerified,
            roles: [UserRole.Admin]
          }
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

  signup(signupData: SignupInfo) {
    if (this.auth) {
      createUserWithEmailAndPassword(this.auth, signupData.email, signupData.password)
        .then((userCredential: UserCredential) => {
          const resUser: User = userCredential.user;
          const resAuthedUser: AuthedUser = { 
            email: resUser.email ? resUser.email : 'Anonymous',
            name: resUser.displayName ? resUser.displayName : 'Anonymous',
            isVerified: resUser.emailVerified,
            roles: [UserRole.Admin]
          }
          this.aUser.set(resAuthedUser);
          console.log('User:', this.aUser());
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      this.firebaseInitError();
    }
  }

  firebaseInitError() {
    console.error('Firebase app not initialized');
  }
}
