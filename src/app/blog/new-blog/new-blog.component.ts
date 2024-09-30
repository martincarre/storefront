import { ChangeDetectionStrategy, Component, inject, signal, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import { Router, RouterLink } from '@angular/router';
import { DynamicFormsModule } from '../../shared/forms/dynamic-forms/dynamic-forms.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { FileInputComponent } from "../../shared/forms/file-input/file-input.component";
import { BlogService } from '../blog.service';
import { NewBlogForm } from './new-blog-form.interface';
import { BlogArticle } from '../blog-details/blog-article.interface';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [RouterLink, DynamicFormsModule, MatSlideToggleModule, MatCardModule, FileInputComponent, MatChipsModule, QuillModule, ],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBlogComponent {
  private fb = inject<FormBuilder>(FormBuilder);
  private router = inject<Router>(Router);
  private blogService = inject<BlogService>(BlogService);
  tags = signal<string[]>([]);
  private currId = signal<string | null>(null);
  currArticle = signal<BlogArticle | null>(null);

  // FormGroup for the entire article form
  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(300)]],
    subtitle: ['', [Validators.required, Validators.maxLength(120)]],
    url: ['', [Validators.maxLength(60)]],
    thumbnailImage: this.fb.group({
      file: [null, Validators.required],
    }),
    sections: this.fb.array([]), // FormArray to hold sections
  });
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  get sections(): FormArray {
    return this.blogForm.get('sections') as FormArray;
  }

  constructor() {
    this.addSection();
  }

  /**
   * Function to handle section management
   * and the related form controls
   */
  // Create a new section form group
  newSection(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.maxLength(120)]],
      content: [null],
      divider: [false],
      illustration: this.fb.group({
        file: [null],
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
    const thumbnailImageGroup = this.blogForm.get('thumbnailImage') as FormGroup;
    thumbnailImageGroup.patchValue({ file: file });
    // Add the 'alt' control if it doesn't exist
    if (!thumbnailImageGroup.contains('alt')) {
      thumbnailImageGroup.addControl('alt', this.fb.control('', [Validators.maxLength(45)]));
    }
  }

  getSectionImage(file: File, index: number): void { 
    const sectionImage = (this.blogForm.get('sections') as FormArray).at(index).get('illustration') as FormGroup;
    sectionImage.patchValue({ file: file });

    if (!sectionImage.contains('alt')) {
      sectionImage.addControl('alt', this.fb.control('', [Validators.maxLength(45)]));
    }
  }

  /**
   * functions to handle tags 
   * and the related form controls
   */
  // Add tag
  addTag(event: MatChipInputEvent): void {
    const value = event.value.trim();

    if (!value) {
      return;
    }

    if (this.tags().includes(value)) {
      return;
    }
    // Ensure the tag is not empty and does not exceed 60 characters
    if (value.length <= 60) {
      const formattedTag = value.replace(/\s+/g, '-'); // Replace spaces with hyphens
      this.tags.update((tags: string[]) => [...tags, formattedTag]);
    }
    else {
      alert('Tag must not exceed 60 characters.');
      return;
    }

    // Reset the input value
    event.chipInput!.clear();
  }

  // Edit tag: 
  editTag(tag: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeTag(tag);
    }
    if (value.length <= 60) {
      const formattedTag = value.replace(/\s+/g, '-');
      this.tags.update((tags: string[]) => {
        const index = tags.indexOf(tag);
        if (index >= 0) {
          tags[index] = formattedTag;
          return [...tags];
        }
        return tags;
      });
    } else {
      alert('Tag must not be empty and must not exceed 60 characters.');
      return;
    }
  }

  // Remove tag
  removeTag(tag: string): void {
    this.tags.update((tags: string[]) => tags.filter(t => t !== tag));
  }

  /**
   * Handling the form submission
   */
  async onSave() {
    const newArticle: NewBlogForm = this.blogForm.value;

    // Ensure the form is valid
    if (this.blogForm.invalid) {
      alert('Please fill out the required fields.');
      return;
    }
    
    // Ensure the form is dirty
    if (!this.blogForm.dirty) { 
      alert('No changes detected. Please make changes before saving.');
      return;
    }

    // Add tags to the new article
    newArticle.tags = this.tags();

    // Ensure the URL is not empty
    if (!newArticle.url) {
      newArticle.url = newArticle.title.trim().replace(/\s+/g, '-').toLowerCase();
    }

    // Save the newBlog article (e.g., send it to the backend)
    const saveRes = await this.blogService.saveBlogArticle(newArticle);
    if (saveRes.success && saveRes.savedArticle) {
      alert('Article saved successfully.');
      this.currId.set(saveRes.savedArticle.id);
      this.currArticle.set(saveRes.savedArticle);
      this.blogForm.markAsPristine();
    }
  }

  async onPublish() {
    const articleToPublish = this.currArticle(); 
    console.log(articleToPublish);
    // if there's no current article then save first. 
    // if there's a current article and the blogForm is dirty, save the changes
    if (!articleToPublish || (articleToPublish && this.blogForm.dirty)) {
      console.log('saving article', articleToPublish);
      await this.onSave();
    }

    if (articleToPublish) {
      const publicationRes = await this.blogService.publishBlogArticle(articleToPublish.id);
      if (publicationRes.success) {
        alert('Article published successfully.');
        this.router.navigate(['news/news-list']);
      }
    }
  }


 
}