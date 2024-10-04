import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal, } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { ImgPreviewComponent } from '../../shared/img-preview/img-preview.component';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [RouterLink, DynamicFormsModule, MatSlideToggleModule, MatCardModule, FileInputComponent, MatChipsModule, QuillModule, ImgPreviewComponent, ],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBlogComponent implements OnInit, OnDestroy {
  private fb = inject<FormBuilder>(FormBuilder);
  private router = inject<Router>(Router);
  private blogService = inject<BlogService>(BlogService);
  private spinner = inject<SpinnerService>(SpinnerService);

  tags = signal<string[]>([]);

  thumbnailPreviewUrl: string | null = null;
  sectionPreviewUrls: (string | null)[] = [];

  private currId = signal<string | null>(null);
  currArticle = signal<BlogArticle | null>(null);
  articleIdInTheUrl = input<string | null>(null, { alias: 'articleId' });
  private articleSub: Subscription = new Subscription();
  
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
    this.initializeForm();
  }

  async ngOnInit() {
    if (this.articleIdInTheUrl()) {
      this.spinner.show();
      this.currId.set(this.articleIdInTheUrl());
      const articleId = this.currId();
      if (articleId) {
        this.articleSub = this.blogService.fetchBlogArticleById(articleId)
          .subscribe((res) => {
            if (res.success) { 
              const fetchedArticle = res.data as BlogArticle;
              this.currArticle.set(fetchedArticle);
              this.initializeForm(fetchedArticle);
              this.spinner.hide();
            }
          });
      }
    }
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
      this.thumbnailPreviewUrl = article.thumbnailImage.imageUrl;
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
        this.sectionPreviewUrls.push(section.illustration?.imageUrl || null);
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

  getThumbnailImage(file: File): void {
    const thumbnailImageGroup = this.blogForm.get('thumbnailImage') as FormGroup;
    
    if (thumbnailImageGroup.get('file')?.value) {
      this.removeImage(thumbnailImageGroup, 'thumbnail');
    }
  
    // Generate the preview URL for the file
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.thumbnailPreviewUrl = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  
    thumbnailImageGroup.patchValue({ file: file });
  
    if (!thumbnailImageGroup.contains('alt')) {
      thumbnailImageGroup.addControl('alt', this.fb.control('', [Validators.maxLength(45)]));
    }
  }
  
  getSectionImage(file: File, index: number): void {
    const sectionImage = (this.blogForm.get('sections') as FormArray).at(index).get('illustration') as FormGroup;
  
    if (sectionImage.get('file')?.value) {
      this.removeImage(sectionImage, 'section');
    }
  
    // Generate the preview URL for the file
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.sectionPreviewUrls[index] = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  
    sectionImage.patchValue({ file: file });
  
    if (!sectionImage.contains('alt')) {
      sectionImage.addControl('alt', this.fb.control('', [Validators.maxLength(45)]));
    }
  }
  
  removeImage(imgGroup: AbstractControl | null, origin: string): void {
    switch (origin) {
      case 'thumbnail':
        this.thumbnailPreviewUrl = null;
        break;
      case 'section':
        const index = this.sectionPreviewUrls.indexOf(imgGroup?.get('file')?.value);
        if (index >= 0) {
          this.sectionPreviewUrls[index] = null;
        }
        break;
    }
    if (imgGroup) {
      imgGroup.patchValue({ file: null, alt: '' });
    }
  }

  // gethumbnailImage(file: File): void {
  //   const thumbnailImageGroup = this.blogForm.get('thumbnailImage') as FormGroup;
  //   thumbnailImageGroup.patchValue({ file: file });
  //   // Add the 'alt' control if it doesn't exist
  //   if (!thumbnailImageGroup.contains('alt')) {
  //     thumbnailImageGroup.addControl('alt', this.fb.control('', [Validators.maxLength(45)]));
  //   }
  // }

  // getSectionImage(file: File, index: number): void { 
  //   const sectionImage = (this.blogForm.get('sections') as FormArray).at(index).get('illustration') as FormGroup;
  //   sectionImage.patchValue({ file: file });

  //   if (!sectionImage.contains('alt')) {
  //     sectionImage.addControl('alt', this.fb.control('', [Validators.maxLength(45)]));
  //   }
  // }

  // removeImage(imgGroup: AbstractControl | null): void {
  //   console.log('remove image', imgGroup);
  // };

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
    // if there's no current article then save first. 
    // if there's a current article and the blogForm is dirty, save the changes
    if (!articleToPublish || (articleToPublish && this.blogForm.dirty)) {
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

  ngOnDestroy(): void {
    this.articleSub.unsubscribe();
  }
 
}