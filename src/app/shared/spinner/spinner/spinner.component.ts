import { ChangeDetectionStrategy, Component, effect, inject, Signal, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
  @if(isLoading()) {
    <div class="spinner-overlay">
      <mat-progress-spinner
        mode="indeterminate">
      </mat-progress-spinner>
    </div>
  }
  `,
  styles: [
    `
      .spinner-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;   /* Full viewport width */
        height: 100vh;  /* Full viewport height */
        background-color: rgba(255, 255, 255, 0.65); /* Slight transparency */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;  /* High z-index to ensure it's above everything */
      }
    `,
  ],
  imports: [MatProgressSpinnerModule], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  private spinnerService: SpinnerService = inject<SpinnerService>(SpinnerService);
  isLoading: Signal<boolean> = this.spinnerService.readonlyIsActive;
}