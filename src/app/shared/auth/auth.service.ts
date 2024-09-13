import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { signInWithEmailAndPassword, signOut, Auth, setPersistence, browserLocalPersistence, onAuthStateChanged, User } from 'firebase/auth';

import { environment } from '../../../environments/environment';
import { AuthedUser } from './authed-user.interface';
import { UserRole } from './user-role.interface';
import { SignupInfo } from './signup.interface';
import { SpinnerService } from '../spinner/spinner.service';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // First setting the firebase and platformId to check if the platform is browser and we've initialized Auth
  private platformId = inject(PLATFORM_ID);
  private firebaseService = inject<FirebaseService>(FirebaseService);
  // Then the spinner and router that we'll need
  private spinner = inject<SpinnerService>(SpinnerService);
  private router = inject<Router>(Router);
  // Setup the private vars
  private auth: Auth | null = null;
  private aUser = signal<AuthedUser | null>(null);
  authedUser = this.aUser.asReadonly();

  constructor() {
    if (this.firebaseService.auth && isPlatformBrowser(this.platformId)) {
      this.auth = this.firebaseService.auth;
      setPersistence(this.auth, browserLocalPersistence);
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          this.aUser.set(await this.fromAuthToUser(user));
          console.log('User:', this.aUser());
        }
      });
    }
  }

  async fromAuthToUser(authUser: User): Promise<AuthedUser> {
    const fetchedUser = await authUser.getIdTokenResult().then((idTokenResult) => {
      return idTokenResult.claims;
    });
    return { 
      uid: authUser.uid,
      email: fetchedUser['email'] as string,
      name: fetchedUser['name'] as string,
      isVerified: fetchedUser['email_verified'] as boolean,
      roles: [(fetchedUser['role'] as string) as UserRole], // TODO: Create the possibility for users ot have multiples roles. At the moement, creating the array here is a hack to keep future functionality in mind.
    };
  }

  // TODO: Here we need to check if the user is verified before logging them in - Write a shared function for signup and login
  login(email: string, password: string) {
    this.spinner.show();
    signInWithEmailAndPassword(this.auth!, email, password)
      .then(() => this.spinner.hide())
      .catch((error) => {
        console.error('Error:', error);
        this.spinner.hide();
      });
  }

  // TODO: Finish handling the logout function: We need to check the email verification status of the user before logging them out
  logout(): void {
    this.auth ? signOut(this.auth) : this.firebaseInitError();
    this.aUser.set(null);
    // TODO make sure we nagivate to the index page
    this.router.navigate(['/']);
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
