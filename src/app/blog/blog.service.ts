import { inject, Injectable } from '@angular/core';
import { BlogArticle, Section } from './blog-details/blog-article.interface';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { NewBlogForm } from './new-blog/new-blog-form.interface';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private firestore = inject(Firestore);
  private articlesCollection = collection(this.firestore, 'articles');
  private http: HttpClient = inject(HttpClient);

  private storage: Storage = inject(Storage);
  private spinner = inject(SpinnerService);

  fetchBlogArticles() {
    return this.http.get(`${environment.httpApiUrls.blogArticles}/fetchBlogPosts`);
  };

  fetchBlogArticleById(id: string) {
    return this.http.get(`${environment.httpApiUrls.blogArticles}/fetchBlogPostById?id=${id}`);
  };
  
  /**
   * Save a new blog article to Firestore.
   * @param blogForm - The form data for the new blog article.
   */
  async saveBlogArticle(blogForm: NewBlogForm): Promise<void> {
    this.spinner.show();
    try {
      // Generate a unique ID for the new article
      const newDocRef = doc(this.articlesCollection);

      // Upload thumbnail image
      blogForm.thumbnailImage.imageUrl = await this.uploadImage(blogForm.thumbnailImage.file, `blog-thumbnails/${newDocRef.id}`);

      // Upload illustrations for each section
      for (let i = 0; i < blogForm.sections.length; i++) {
        const illustration = blogForm.sections[i].illustration;
        if (illustration && illustration.file) { 
          illustration.imageUrl = await this.uploadImage(illustration.file, `blog-illustrations/${newDocRef.id}-${i}`);
        } else if (illustration) {
          illustration.imageUrl = '';
        }
      }

      // Adapt sections to the BlogArticle Interface
      const sections: Section[] = this.adaptSectionToBlogArticle(blogForm.sections);
      
      // Create the new BlogArticle object
      const newBlog: BlogArticle = {
        title: blogForm.title,
        published: false,
        description: blogForm.description,
        subtitle: blogForm.subtitle,
        date: new Date(),
        sections: sections,
        id: newDocRef.id,
        thumbnailImage: { imageUrl: blogForm.thumbnailImage.imageUrl, alt: blogForm.thumbnailImage.alt },
        author: 'Current User' // TODO: Replace with dynamic author assignment
      };

      // Save the new blog article to Firestore
      await setDoc(newDocRef, newBlog);
      console.log('Blog article saved successfully.');
    } catch (error) {
      console.error('Error saving blog article:', error);
      alert('Error saving article. Please try again later.');
    } finally {
      this.spinner.hide();
    }
  }

  /**
   * Adapt sections from the form to the BlogArticle interface.
   * @param formSections - Sections from the blog form.
   * @returns Adapted sections.
   */
  adaptSectionToBlogArticle(formSections: Section[]): Section[] {
    return formSections.map(section => {
      let sectionIllustration: { imageUrl: string, alt: string } | null = null;
      if (section.illustration && section.illustration.imageUrl !== '') {
        sectionIllustration = {
          imageUrl: section.illustration.imageUrl,
          alt: section.illustration.alt ? section.illustration.alt : '',
        };
      }
      return {
        title: section.title ? section.title : null,
        content: section.content ? section.content : '',
        divider: section.divider,
        illustration: sectionIllustration,
        callToAction: section.callToAction ? section.callToAction : null
      };
    });
  }

  /**
   * Upload an image to Firebase Storage.
   * @param file - The image file to upload.
   * @param path - The storage path where the image will be stored.
   * @returns The download URL of the uploaded image.
   */
  async uploadImage(file: File, path: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Image upload failed:', error);
          reject(error);
        },
        async () => {
          // File uploaded successfully, get the download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Convert Firestore timestamp to JavaScript Date.
   * @param timestamp - Firestore timestamp.
   * @returns JavaScript Date object.
   */
  timestampToDate(timestamp: any): Date {
    return timestamp.toDate();
  }
}