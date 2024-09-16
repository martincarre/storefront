import { inject, Injectable, Signal, signal } from '@angular/core';
import { FirebaseService } from '../shared/firebase.service';
import { MOCKBLOGARTICLES } from './blog-articles.mock-data';
import { BlogArticle } from './blog-details/blog-article.class';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // private firebaseService = inject<FirebaseService>(FirebaseService);
  private mockBlogThumbnails = signal<BlogArticle[]>(MOCKBLOGARTICLES);
  blogList = this.mockBlogThumbnails.asReadonly();

}
