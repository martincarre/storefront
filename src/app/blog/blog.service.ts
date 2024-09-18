import { afterNextRender, inject, Injectable, Signal, signal } from '@angular/core';
import { FirebaseService } from '../shared/firebase.service';
import { MOCKBLOGARTICLES } from './blog-articles.mock-data';
import { BlogArticle, Section } from './blog-details/blog-article.interface';
import { NewBlogForm } from './new-blog/new-blog-form.interface';
import { collection, doc, DocumentReference, setDoc } from 'firebase/firestore';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private firebaseService = inject<FirebaseService>(FirebaseService);
  private mockBlogThumbnails = signal<BlogArticle[]>(MOCKBLOGARTICLES.filter((blog: BlogArticle) => blog.published));
  private spinner = inject<SpinnerService>(SpinnerService);
  blogList = this.mockBlogThumbnails.asReadonly();
  docRef: DocumentReference | null = null;

  constructor() {
    afterNextRender(() => {
      const firestore = this.firebaseService.firestore;
      if (firestore) {
        this.docRef =  doc(collection(firestore, 'articles'));
      }
    });
  }
  
  async saveBlogArticle(blogForm: NewBlogForm): Promise<void> {
    this.spinner.show();
    // Generate a unique ID for the new article
    const blogId = this.generateId();
    if (blogId === '') {
      console.error('Error generating ID for new article.');
      alert('Error saving article. Please try again later.');
      return;
    }
    // First transform the image files into URLs
    blogForm.thumbnailImage.imageUrl = await this.firebaseService.uploadFile(blogForm.thumbnailImage.file, `blog-thumbnails/${blogId}`);
    for (let i = 0; i < blogForm.sections.length; i++) {
      const illustration = blogForm.sections[i].illustration;
      if (illustration) { 
        if (illustration.file) {
          illustration.imageUrl = await this.firebaseService.uploadFile(illustration.file, `blog-illustrations/${blogId}`);
        } 
        else {
          illustration.imageUrl = '';
        }
      }
    }

    // Adapt sections to the BlogArticle class
    const sections: Section[] = blogForm.sections.map(section => {
      // Checking if there is an illustration to include in the section
      let sectionIllustration: {imageUrl: string, alt: string} | null = null;
      if (section.illustration && section.illustration.imageUrl !== '') {
        // Editing the sectionIllustration object to include the URL and avoid the file
        sectionIllustration = {
          imageUrl: section.illustration.imageUrl,
          alt: section.illustration.alt
        };
      }
      // Returning the section object with the correct illustration: {imageUrl: string, alt: string} or undefined
      return {
        title: section.title ? section.title : null,
        content: section.content ? section.content : '',
        divider: section.divider,
        illustration: sectionIllustration,
        callToAction: section.callToAction ? section.callToAction : null
      };
    });
    // Creating the new BlogArticle object
    const newBlog: BlogArticle = {
      title: blogForm.title,
      published: false,
      description: blogForm.description,
      subtitle: blogForm.subtitle,
      date: new Date(),
      sections: sections,
      id: blogId,
      thumbnailImage: {imageUrl: blogForm.thumbnailImage.imageUrl, alt: blogForm.thumbnailImage.alt},
      author: 'Current User' // TODO: Replace with dynamic author assignment
    };

    // Saving the new blog article to Firestore
    if (this.docRef) {
      setDoc(this.docRef, newBlog)
      .then((res) => {
        console.log(res);
        this.spinner.hide();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
        alert('Error saving article. Please try again later.');
        this.spinner.hide();
      });
    }
  }

  // Dummy ID generator (in real scenario, this could be more robust)
  private generateId(): string {
    if (!this.docRef) { 
      return '';
    } else {
      return this.docRef.id;
    }
  }

}
