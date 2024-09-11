import { isPlatformBrowser } from '@angular/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, User, UserCredential, signOut, Auth, connectAuthEmulator } from 'firebase/auth';

import { environment } from '../../../environments/environment';
import { AuthedUser } from './authed-user.interface';
import { UserRole } from './user-role.interface';
import { SpinnerService } from '../spinner/spinner.service';

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
  private spinner = inject<SpinnerService>(SpinnerService);

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

  async signup(signupData: SignupInfo): Promise<Response> {
    let apiUri: string = '';
    this.spinner.show();
    console.log('Signup Data:', signupData);
    if (environment.useEmulators) {
      apiUri = environment.emulators.functions.url + '/signup';
    } else { 
      apiUri = ''; // TODO: Add production URL
    }
    console.log('API URI:', apiUri);
    const response: Response = await fetch(apiUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });
    console.log('Response received');
    this.spinner.hide();
    if (response.status === 201) {
      console.log('Success', response); 
      return response;
    } else {
      console.error('Error:', response);
      return response;
      // TODO: ERROR HANDLING
    }
  }

  firebaseInitError() {
    console.error('Firebase app not initialized');
  }
}
