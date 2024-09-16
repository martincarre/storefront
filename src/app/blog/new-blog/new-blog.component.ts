import { ChangeDetectionStrategy, Component, inject, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DynamicFormsModule } from '../../shared/forms/dynamic-forms.module';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [RouterLink, DynamicFormsModule],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBlogComponent {
  private fb = inject<FormBuilder>(FormBuilder);
  articleForm: FormGroup;

  constructor() {
    this.articleForm = this.fb.group({ 

    })
  }

  onSaveArticle() {
    console.log(this.articleForm.value);
  }
}
