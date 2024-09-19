import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal, Signal, } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BlogService } from '../blog.service';
import { BlogThumbnailComponent } from './blog-thumbnail/blog-thumbnail.component';
import { BlogArticle } from '../blog-details/blog-article.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [BlogThumbnailComponent, MatPaginatorModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent {
  private blogService = inject<BlogService>(BlogService);
  private blogs: Signal<BlogArticle[]> = signal<BlogArticle[]>([]);
  paginatedBlogs = computed<BlogArticle[]>(() => {
    const allBlogs = this.blogs();
    const size = this.pageSize();
    const index = 0;
    const start = index * size;
    return allBlogs.slice(start, start + size);
  });
  pageSize = signal<number>(5);

  constructor() { 
    this.blogService.fetchBlogArticles();
    this.blogs = this.blogService.articleList;
  }

  get blogsLength(): number {
    return 1;
  };

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    // this.paginatedBlogsInit.set(this.blogs().slice(startIndex, endIndex));
  };

}
