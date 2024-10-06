import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { BlogArticle } from '../blog-details/blog-article.interface';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blogpost-edit',
  standalone: true,
  imports: [],
  templateUrl: './blogpost-edit.component.html',
  styleUrl: './blogpost-edit.component.scss'
})
export class BlogpostEditComponent implements OnInit, OnDestroy {
  private spinner = inject<SpinnerService>(SpinnerService);
  private router = inject<Router>(Router); 
  private blogService = inject<BlogService>(BlogService);
  private destroyed$ = new Subject();
  articleId = input.required<string>();
  article = signal<BlogArticle | null>(null);

  ngOnInit(): void {
    this.spinner.show();
      if (this.articleId()) {
        this.blogService.fetchBlogArticleById(this.articleId())
          .pipe(takeUntil(this.destroyed$))
          .subscribe((res: any) => {
            if (res.success) { 
              this.spinner.hide();
              this.article.set(res.data);
            }
          });
      }
  }

  async onPublish() {
    const articleToPublish = this.article(); 
    
    if (articleToPublish) {
      const publicationRes = await this.blogService.publishBlogArticle(articleToPublish.id);
      if (publicationRes.success) {
        alert('Article published successfully.');
        this.router.navigate(['news/news-list']);
      }
    }
  }


  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

}
