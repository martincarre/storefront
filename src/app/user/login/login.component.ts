import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionBase } from '../../shared/forms/dynamic-forms/question-classes/question-base.class';
import { StyleSection } from '../../shared/forms/dynamic-forms/question-classes/form-style-section.class';
import { UserModule } from '../user.module';
import { LoginFormService } from './login-form.service';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [UserModule, MatButtonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  lfs = inject<LoginFormService>(LoginFormService);
  private authService = inject<AuthService>(AuthService);

  questions: Signal<(QuestionBase<string> | StyleSection<any> )[]>;
  constructor() { 
    this.questions = this.lfs.form;
  }

  onLogin($event: FormGroup) {
    this.authService.login($event.value.email, $event.value.password);
  }
}
