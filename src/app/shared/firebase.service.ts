import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
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
  storage: FirebaseStorage | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      if (!getApps().length) {
        this.app = initializeApp(environment.firebaseConfig);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
        this.storage = getStorage(this.app);
        
        // Connect to Firebase Emulators in development
        if (environment.useEmulators) {
          connectAuthEmulator(this.auth, environment.emulators.auth.url? environment.emulators.auth.url : '');
          connectFirestoreEmulator(this.firestore, environment.emulators.firestore.host, environment.emulators.firestore.port);
          connectStorageEmulator(this.storage, 'localhost', 9199);
          console.log('Connected to Firebase Emulators');
        } else {
          console.log('Using production Firebase services');
        }
      } else {
        // Reuse existing app if already initialized
        this.app = getApp();
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
        this.storage = getStorage(this.app);
      }
    } else {
      console.error('Firebase will be initialized in the browser. If you\'re using SSR then this is expected behavior.');
    }
  }

  // Upload a file to Firebase Storage
  async uploadFile(file: File, path: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        console.error('No file found');
        reject('No file provided');
      }
      if (!path) {
        console.error('No path found');
        reject('No path provided');
      }
      if (!this.storage) {
        console.error('Firebase Storage is not initialized');
        reject('Firebase Storage is not initialized');
      }
      else {
        const storageRef = ref(this.storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            reject(error);
          },
          async () => {
            // File uploaded successfully, get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      }
    });
  }
}
