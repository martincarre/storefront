import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { SignupFormService } from './signup-form.service';
import { QuestionBase } from '../../shared/forms/dynamic-forms/question-classes/question-base.class';
import { StyleSection } from '../../shared/forms/dynamic-forms/question-classes/form-style-section.class';
import { UserModule } from '../user.module';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [UserModule, MatButtonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  sufs = inject<SignupFormService>(SignupFormService);
  authService = inject<AuthService>(AuthService);
  questions: Signal<(QuestionBase<string> | StyleSection<any> )[]>;

  constructor() { 
    this.questions = this.sufs.form;
  }

  onSubmit($event: any) {
    this.authService.signup(($event as FormGroup).value);
  }
}
