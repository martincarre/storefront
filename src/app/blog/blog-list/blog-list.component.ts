import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BlogThumbnailComponent } from './blog-thumbnail/blog-thumbnail.component';
import { RouterLink } from '@angular/router';
import { BlogService } from '../blog.service';
import { FunctionServerResponse } from '../../shared/function-server-response.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [MatPaginatorModule, MatButtonModule, MatIconModule, BlogThumbnailComponent, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogService);
  private articlesSubscription: Subscription = new Subscription();
  blogPosts = signal([]);

  ngOnInit() {
    this.blogService.fetchBlogArticles().subscribe((res: FunctionServerResponse) => {
      this.blogPosts.set(res.data);
    });
  }

  // Signals for pagination
  pageSize = signal(6);
  pageIndex = signal(0);

  // Computed signal for paginated blogs
  paginatedBlogs = this.blogPosts;
  // computed(() => {
  //     const allBlogs = this.blogPosts();
  //     const size = this.pageSize();
  //     const index = this.pageIndex();
  //     const start = index * size;
  //     return allBlogs.slice(start, start + size);
  // });

  get blogsLength(): number {
    return this.blogPosts.length;
  };

  // Handle page changes
  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  ngOnDestroy(): void {
    this.articlesSubscription.unsubscribe();
  }
}