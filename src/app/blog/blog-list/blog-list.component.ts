import { ChangeDetectionStrategy, Component, effect, inject, signal, Signal, } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NewBlogComponent } from "../new-blog/new-blog.component";
// import { BlogThumbnail } from './blog-thumbnail/blog-article-base.class';
import { BlogService } from '../blog.service';
import { BlogThumbnailComponent } from './blog-thumbnail/blog-thumbnail.component';
import { BlogArticleBase } from './blog-thumbnail/blog-article-base.class';
import { BlogArticle } from '../blog-details/blog-article.class';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [BlogThumbnailComponent, MatPaginatorModule, NewBlogComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent {
  private blogService = inject<BlogService>(BlogService);
  private blogs: Signal<BlogArticle[]> = this.blogService.blogList;
  private paginatedBlogsInit = signal<BlogArticle[]>([]);
  paginatedBlogs = this.paginatedBlogsInit.asReadonly();
  pageSize: number = 6;

  constructor() {
    this.paginatedBlogsInit.set(this.blogs().slice(0, this.pageSize));
  }

  get blogsLength(): number {
    return this.blogs().length;
  };

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedBlogsInit.set(this.blogs().slice(startIndex, endIndex));
  };

}
