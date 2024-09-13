import { computed, effect, inject, Injectable, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import { FirebaseService } from '../shared/firebase.service';
import { Firestore, collection, doc, DocumentReference, getDoc, CollectionReference } from 'firebase/firestore';
import { AuthService } from '../shared/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // First setting the firebase and platformId to check if the platform is browser and we've initialized the Firestore
  private firebaseService = inject<FirebaseService>(FirebaseService);
  private platformId = inject(PLATFORM_ID);
  // Then setup the auth service to get the signal of the current user
  private authService = inject<AuthService>(AuthService);
  private authedUser = this.authService.authedUser;
  private spinner = inject<SpinnerService>(SpinnerService);
  // Finally setup what this service will serve to the rest of the application
  // Starting with the private vars
  private currUserDocRef: WritableSignal<DocumentReference | null> = signal<DocumentReference | null>(null);
  private currUserData: WritableSignal<any | null> = signal<any | null>(null);
  private usersRef: CollectionReference | null = null; 
  // Then the public vars
  public userData = this.currUserData.asReadonly();

  constructor() {
    // Check the platform and initialize the Firestore database
    if (isPlatformBrowser(this.platformId) && this.firebaseService.firestore) {
      // Get the current user and setup the signals
      this.usersRef = collection(this.firebaseService.firestore, 'users');
      
      effect(() => {
        const user = this.authedUser();
        if (user && user.uid) {
          this.fetchUserRef(user.uid); 
        }
      }, { allowSignalWrites: true })
    }
  }
  
  
  async fetchUserRef(uid: string) { 
    if (this.usersRef) {
      this.spinner.show();
      this.currUserDocRef.set(doc(this.usersRef, uid));
      if (this.currUserDocRef()) {
        // If the user exists and was found in the database, return the user's data
        this.currUserData.set((await getDoc(this.currUserDocRef() as DocumentReference)).data());
        this.spinner.hide();
        if (!this.currUserData()) {
          // If the user doesn't exist in the database (impossible), logout and create a warning
          console.error('User not found in database, signing out');
          this.authService.logout();
        }
      }
    }
  }

}
