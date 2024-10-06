import { inject, Injectable } from '@angular/core';
import { BlogArticle, Section } from './blog-details/blog-article.interface';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FunctionServerResponse } from '../shared/function-server-response.interface';
import { updateDoc } from 'firebase/firestore';
import { BlogForm } from './blogpost-form/new-blog-form.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private firestore = inject(Firestore);
  private http: HttpClient = inject(HttpClient);
  private storage: Storage = inject(Storage);

  fetchBlogArticles(): Observable<FunctionServerResponse> {
    return this.http.get<FunctionServerResponse>(`${environment.httpApiUrls.blogArticles}/fetchBlogPosts`);
  };

  fetchBlogArticleById(id: string): Observable<FunctionServerResponse> {
    return this.http.get<FunctionServerResponse>(`${environment.httpApiUrls.blogArticles}/fetchBlogPostById?id=${id}`);
  };
  
  /**
   * Save a new blog article to Firestore.
   * @param blogForm - The form data for the new blog article.
  */
  async saveBlogArticle(blogForm: BlogForm): Promise<{success: boolean, savedArticle: BlogArticle | null}> {
    try {

      // Adapt the url to become the document ID
      blogForm.url = blogForm.url.replace(/\s+/g, '-').toLowerCase();

      // Generate a docRef for the new article
      const newDocRef = doc(this.firestore, 'articles', blogForm.url);

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
        tags: blogForm.tags,
        sections: sections,
        url: blogForm.url,
        id: newDocRef.id,
        thumbnailImage: { imageUrl: blogForm.thumbnailImage.imageUrl, alt: blogForm.thumbnailImage.alt },
        author: 'Current User' // TODO: Replace with dynamic author assignment
      };

      // Save the new blog article to Firestore
      await setDoc(newDocRef, newBlog);
      console.log('Blog article saved successfully.');
      return Promise.resolve({ success: true, savedArticle: newBlog });
    } catch (error) {
      console.error('Error saving blog article:', error);
      alert(`Error saving article. Please try again later. Error reference: ${error}`);
      return Promise.resolve({ success: false, savedArticle: null });
    }
  }

  async publishBlogArticle(id: string): Promise<{success: boolean}> {
    try {
      await updateDoc(doc(this.firestore, 'articles', id), { published: true });
      console.log('Blog article published successfully.');
      return Promise.resolve({ success: true });
    }
    catch (error) {
      console.error('Error publishing blog article:', error);
      alert(`Error publishing article. Please try again later. Error reference: ${error}`);
      return Promise.resolve({ success: false });
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