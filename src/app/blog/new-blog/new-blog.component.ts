import { afterNextRender, ChangeDetectionStrategy, Component, inject, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DynamicFormsModule } from '../../shared/forms/dynamic-forms/dynamic-forms.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { BlogArticle } from '../blog-details/blog-article.interface';
import { FirebaseService } from '../../shared/firebase.service';
import { FileInputComponent } from "../../shared/forms/file-input/file-input.component";
import { collection, doc, DocumentReference } from 'firebase/firestore';
import { BlogService } from '../blog.service';
import { NewBlogForm } from './new-blog-form.interface';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [RouterLink, DynamicFormsModule, MatSlideToggleModule, MatCardModule, FileInputComponent],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBlogComponent {
  private fb = inject<FormBuilder>(FormBuilder);
  private firebaseService = inject<FirebaseService>(FirebaseService);
  private blogService = inject<BlogService>(BlogService);
  // FormGroup for the entire article form
  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required]],
    subtitle: ['', [Validators.required, Validators.maxLength(120)]],
    thumbnailImage: this.fb.group({
      file: [null, Validators.required],
      alt: ['', [Validators.maxLength(45)]]
    }),
    sections: this.fb.array([]), // FormArray to hold sections
  });
  

  get sections(): FormArray {
    return this.blogForm.get('sections') as FormArray;
  }

  constructor() {
    this.addSection();
    
  }

  // Create a new section form group
  newSection(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.maxLength(120)]],
      content: [''],
      divider: [false],
      illustration: this.fb.group({
        file: [null],
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

  gethumbnailImage(file: File): void {
    this.blogForm.get('thumbnailImage')?.patchValue({ file: file });
  }

  getSectionImage(file: File, index: number): void { 
    this.sections.at(index).get('illustration')?.patchValue({ file: file });
  }


  // Handle form submission
  onSave(): void {
    const newArticle: NewBlogForm = this.blogForm.value;
    // if (this.blogForm.valid) {
     
    // Save the newBlog article (e.g., send it to the backend)
    this.blogService.saveBlogArticle(newArticle);

      // Navigate back to the blog list
      // this.router.navigate(['/news/news-list']);
    // }
  }

  
}
