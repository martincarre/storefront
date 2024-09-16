import { ChangeDetectionStrategy, Component, inject, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DynamicFormsModule } from '../../shared/forms/dynamic-forms.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { BlogArticle } from '../blog-details/blog-article.class';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [RouterLink, DynamicFormsModule, MatSlideToggleModule, MatCardModule],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBlogComponent {
  private fb = inject<FormBuilder>(FormBuilder);
  private router = inject(Router);
  // FormGroup for the entire article form
  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required]],
    subtitle: ['', [Validators.required, Validators.maxLength(120)]],
    thumbnailImage: this.fb.group({
      imageUrl: ['', Validators.required],
      alt: ['', [Validators.maxLength(45)]]
    }),
    sections: this.fb.array([]), // FormArray to hold sections
  });

  get sections(): FormArray {
    return this.blogForm.get('sections') as FormArray;
  }

  constructor() {
    this.addSection(); // Start with one section by default
  }

  // Create a new section form group
  newSection(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.maxLength(120)]],
      content: [''],
      divider: [false],
      illustration: this.fb.group({
        imageUrl: [''],
        alt: ['', [Validators.maxLength(45)]]
      })
    });
  }

  // Add a new section to the FormArray
  addSection(): void {
    if (this.sections.length < 10) {
      this.sections.push(this.newSection());
    }
  }

  // Remove a section from the FormArray
  removeSection(index: number): void {
    this.sections.removeAt(index);
  }

  // Handle form submission
  onSubmit(): void {
    console.log(this.blogForm.value);
    if (this.blogForm.valid) {
      const newBlog: BlogArticle = new BlogArticle({
        title: this.blogForm.value.title,
        description: this.blogForm.value.description,
        subtitle: this.blogForm.value.subtitle,
        sections: this.blogForm.value.sections,
        date: new Date(),
        id: this.generateId(),
        thumbnailImage: this.blogForm.value.thumbnailImage,
        author: 'Current User' // Replace with dynamic author assignment
      });

      // Save the newBlog article (e.g., send it to the backend)
      console.log(newBlog);

      // Navigate back to the blog list
      // this.router.navigate(['/news/news-list']);
    }
  }

  // Dummy ID generator (in real scenario, this could be more robust)
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
