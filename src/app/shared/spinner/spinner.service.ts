import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isActive = signal<boolean>(false);
  readonly readonlyIsActive = this.isActive.asReadonly();

  // Show the spinner
  show() {
    this.isActive.set(true);
  }

  // Hide the spinner
  hide() {
    this.isActive.set(false);
  }
}

