import { isPlatformBrowser } from '@angular/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, User, Auth, connectAuthEmulator } from 'firebase/auth';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private platformId = inject(PLATFORM_ID);

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
}
