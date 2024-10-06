import { Component, inject, signal } from '@angular/core';
import { FileInputComponent } from '../../shared/forms/file-input/file-input.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogArticle } from '../blog-details/blog-article.interface';
import { MatChipEditedEvent, MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRow } from '@angular/material/chips';
import { QuillModule } from 'ngx-quill';
import { ImgPreviewComponent } from '../../shared/img-preview/img-preview.component';
import { DynamicFormsModule } from '../../shared/forms/dynamic-forms/dynamic-forms.module';
import { MatCardModule } from '@angular/material/card';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blogpost-form',
  standalone: true,
  imports: [
    RouterLink,
    FileInputComponent,
    QuillModule,
    MatChipInput,
    MatChipGrid,
    MatChipRow,
    ImgPreviewComponent,
    DynamicFormsModule,
    MatCardModule
  ],
  templateUrl: './blogpost-form.component.html',
  styleUrl: './blogpost-form.component.scss'
})
export class BlogpostFormComponent {
  private fb = inject<FormBuilder>(FormBuilder);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags = signal<string[]>([]);
  editMode = false;

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
  

  get sections(): FormArray {
    return this.blogForm.get('sections') as FormArray;
  }

  onPublish(): void {
    console.log('TODO: Publishing article...');
  }

  /**
 * If there is an existing article, populate the form with its data
 */
  initializeForm(article?: BlogArticle): void {
    // Set the main fields
    this.blogForm = this.fb.group({
      title: [article? article.title : '', [Validators.required, Validators.maxLength(120)]],
      description: [article ? article.description : '', [Validators.required, Validators.maxLength(300)]],
      subtitle: [article ? article.subtitle : '', [Validators.required, Validators.maxLength(120)]],
      url: [article ? article.url : '', [Validators.maxLength(60)]],
      thumbnailImage: this.fb.group({
        file: [article ? article.thumbnailImage.imageUrl : null, Validators.required],
        alt: [article ? article.thumbnailImage.alt : '', [Validators.maxLength(45), Validators.required]],
      }),
      sections: this.fb.array([]), // FormArray to hold sections
    });
    
    if (article) {
      // Clear existing sections in the FormArray
      this.sections.clear();
    
      // Populate the sections
      article.sections.forEach((section) => {
        const sectionGroup = this.fb.group({
          title: [section.title, [Validators.maxLength(120)]],
          content: [section.content], // Populate the Quill editor content here
          divider: [section.divider],
          illustration: this.fb.group({
            file: [section.illustration?.imageUrl],  // Assuming the image URL
            alt: [section.illustration?.alt, [Validators.maxLength(45)]]
          })
        });
        this.sections.push(sectionGroup);

      });
    
      // Populate the tags if they exist
      if (article.tags) {
        this.tags.set(article.tags);
      }
    } else { 
      this.addSection();
    }
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

  handleImage(file: File | null, controlPath: string, index?: number): void {
    let imageControl: FormGroup;
  
    if (index !== undefined) {
      // For section images, get the specific section's illustration control
      imageControl = (this.blogForm.get(controlPath) as FormArray).at(index).get('illustration') as FormGroup;
    } else {
      // For thumbnail image, get the thumbnailImage control
      imageControl = this.blogForm.get(controlPath) as FormGroup;
    }
  
    if (file) {
      // If a file is provided, update the form control with the file
      imageControl.patchValue({ file: file });
  
      // Add the 'alt' control if it doesn't exist (common for both cases)
      if (!imageControl.contains('alt')) {
        imageControl.addControl('alt', this.fb.control('', [Validators.required, Validators.maxLength(45)]));
      }
      
  
    } else {
      // If no file is provided (file is null), remove the file
      imageControl.patchValue({ file: null });
  
      // Optionally reset the alt control
      if (imageControl.contains('alt')) {
        if (index == undefined) {
          imageControl.get('alt')?.reset();
        }
        else {
          imageControl.removeControl('alt');
        }
      }
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

  onSubmit(): void {
    // TODO: get the save function call here????

    // if there's no current article then save first. 
    // if there's a current article and the blogForm is dirty, save the changes
    // if (!articleToPublish || (articleToPublish && this.blogForm.dirty)) {
    //   await this.onSave();
    // }

    // // Ensure the URL is not empty
    // if (!newArticle.url) {
    //   newArticle.url = newArticle.title.trim().replace(/\s+/g, '-').toLowerCase();
    // }
  }

}
