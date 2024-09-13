import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { UserService } from '../user.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {
  private userService = inject<UserService>(UserService);
  currUserData = this.userService.userData;
} 
