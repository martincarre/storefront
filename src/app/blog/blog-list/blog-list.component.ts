import { Component, computed, inject, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BlogThumbnailComponent } from './blog-thumbnail/blog-thumbnail.component';
import { RouterLink } from '@angular/router';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [MatPaginatorModule, MatButtonModule, MatIconModule, BlogThumbnailComponent, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent {
  private blogService = inject(BlogService);
  blogPosts = signal([]);

  ngOnInit() {
    this.blogService.fetchBlogArticles().subscribe((articles: any) => {
      console.log(articles.data);
      this.blogPosts.set(articles.data);
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
}