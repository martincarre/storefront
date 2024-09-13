import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private platformId = inject(PLATFORM_ID);
  app: FirebaseApp | null = null;
  auth: Auth | null = null;
  firestore: Firestore | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      if (!getApps().length) {
        this.app = initializeApp(environment.firebaseConfig);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
        
        // Connect to Firebase Emulators in development
        if (environment.useEmulators) {
          connectAuthEmulator(this.auth, environment.emulators.auth.url? environment.emulators.auth.url : '');
          connectFirestoreEmulator(this.firestore, environment.emulators.firestore.host, environment.emulators.firestore.port);
          console.log('Connected to Firebase Emulators');
        } else {
          console.log('Using production Firebase services');
        }
      } else {
        // Reuse existing app if already initialized
        this.app = getApp();
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
      }
    } else {
      console.error('Firebase will be initialized in the browser. If you\'re using SSR then this is expected behavior.');
    }
  }
}
