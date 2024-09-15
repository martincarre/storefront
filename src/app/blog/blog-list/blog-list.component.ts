import { Component, effect, inject, Signal, signal } from '@angular/core';
import { NewBlogComponent } from "../new-blog/new-blog.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BlogThumbnail } from './blog-thumbnail.interface';
import { BlogService } from '../blog.service';
import { BlogThumbnailComponent } from './blog-thumbnail/blog-thumbnail.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [BlogThumbnailComponent, NewBlogComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  private blogService = inject<BlogService>(BlogService);
  blogs: Signal<BlogThumbnail[]> = this.blogService.blogList;
}
