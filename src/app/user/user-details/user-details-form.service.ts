import { effect, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop'
import { QuestionBase } from '../../shared/forms/dynamic-forms/question-classes/question-base.class';
import { StyleSection } from '../../shared/forms/dynamic-forms/question-classes/form-style-section.class';
import { TextboxQuestion } from '../../shared/forms/dynamic-forms/question-classes/question-textbox.class';
import { DropdownQuestion } from '../../shared/forms/dynamic-forms/question-classes/question-dropdown.class';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsFormService {
  private formQuestions = signal<(QuestionBase<string> | StyleSection<any>)[]>([]);
  private userService = inject<UserService>(UserService);

  constructor() {
    effect(() => {
      const userData = this.userService.userData();
      if (userData) {
        this.setupQuestions();
      }
    }, { allowSignalWrites: true });
  }

  getQuestions(): Observable<(QuestionBase<string>| StyleSection<any>)[]> {
    return toObservable(this.formQuestions);
  }

  private setupQuestions() {
    const questions: (QuestionBase<string> | StyleSection<any>)[] = [ 
      new StyleSection({
        order: 1,
        title: 'Personal Information',
        divider: true,
      }),
      new DropdownQuestion({
        key: 'role',
        label: 'Role',
        value: this.userService.userData().role,
        options: [
          { value: 'C-suite', key: 'csuite' },
          { value: 'Sales', key: 'sales' },
          { value: 'Marketing', key: 'marketing' },
          { value: 'Operations', key: 'operations' },
          { value: 'Finance', key: 'finance' },
          { value: 'Intern', key: 'intern' },
          { value: 'Student', key: 'student' },          
        ],
        order: 2,
        // required: true,
        materialCss: 'outline',
      }),
      new TextboxQuestion({ 
        key: 'name',
        label: 'Name',
        value: this.userService.userData().name,
        materialCss: 'outline',
        // required: true,
        order: 3,
        suffix: 'badge'
      }),
      new TextboxQuestion({
        key: 'email',
        label: 'Email',
        type: 'email',
        value: this.userService.userData().email,
        materialCss: 'outline',
        // required: true,
        order: 3,
        suffix: 'email',
      }),
      new StyleSection({
        order: 7,
        title: 'Business Information',
        divider: true
      }),
      new DropdownQuestion({
        key: 'businessType',
        label: 'Business Type',
        value: this.userService.userData().businessType,
        options: [
          { value: 'B2B', key: 'b2b' },
          { value: 'B2C', key: 'b2c' },
          { value: 'B2G', key: 'b2g' },
          { value: 'School', key: 'school'},
          { value: 'Government', key: 'government' },
          { value: 'Non-profit', key: 'nonprofit' },
        ],
        materialCss: 'outline',
        order: 8,
      }),
      new TextboxQuestion({
        key: 'businessName',
        label: 'Business Name',
        value: this.userService.userData().businessName,
        order: 9,
        // required: true,
        materialCss: 'outline',
        suffix: 'work'
      }),
      new TextboxQuestion({
        key: 'businessWebsite',
        label: 'Business Website',
        value: this.userService.userData().businessWebsite,
        order: 10,
        materialCss: 'outline',
        suffix: 'language'
      }),
      new StyleSection({
        order: 11,
        content: 'Tell us how you\'re going to use our platform',
      }),
      new DropdownQuestion({
        key: 'useCase',
        label: 'Use Case',
        value: this.userService.userData().useCase,
        options: [
          { value: 'To find new customers', key: 'new_customers' },
          { value: 'To know about my competition', key: 'competition' },
          { value: 'Research for a paper or an assignment', key: 'research' },
          { value: 'General market research', key: 'market_research' },
          { value: 'Other', key: 'other' },
        ],
        order: 12,
        materialCss: 'outline',
      }),
    ]
    this.formQuestions.set(questions.sort((a, b) => a.order - b.order));
  }
}
