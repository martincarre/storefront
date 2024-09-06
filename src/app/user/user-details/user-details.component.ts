import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {

}
