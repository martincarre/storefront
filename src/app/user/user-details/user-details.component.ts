import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { DynamicFormComponent } from '../../shared/forms/dynamic-forms/dynamic-form/dynamic-form.component';
import { MatCardModule } from '@angular/material/card';
import { UserDetailsFormService } from './user-details-form.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [DynamicFormComponent, MatCardModule, MatButtonModule, AsyncPipe, JsonPipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {
  private userService = inject<UserService>(UserService);
  private udfs = inject<UserDetailsFormService>(UserDetailsFormService);
  currUserData = this.userService.userData;
  questions = this.udfs.form;

  onSave($event: any) {
    if ($event.untouched) {
      alert('Please fill out the form');
    }
    console.log($event.value);
  }
} 
