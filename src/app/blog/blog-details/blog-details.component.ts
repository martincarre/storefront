import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { BlogService } from '../blog.service';
import { DatePipe, NgClass } from '@angular/common';
import { BlogArticle } from './blog-article.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FunctionServerResponse } from '../../shared/function-server-response.interface';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SpinnerService } from '../../shared/spinner/spinner.service';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [DatePipe, MatDividerModule, MatButtonModule, MatIconModule, RouterLink, MatCardModule, NgClass, MatToolbarModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  private blogService = inject<BlogService>(BlogService);
  private spinner = inject<SpinnerService>(SpinnerService);
  private articleSubscription: Subscription = new Subscription();
  private sanitizer = inject<DomSanitizer>(DomSanitizer);
  articleId = input.required<string>();
  article = signal<BlogArticle | null>(null);
  showFallback = signal<boolean>(false);
  showIllustrationFallback = signal<number[]>([]);

  // Use the DomSanitizer to bypass sanitization
  sanitizeContent(content: string): SafeHtml {
    // if (isPlatformBrowser(this.platformId)) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnInit() {
    if (this.articleId()) {
      this.spinner.show();
      this.articleSubscription = this.blogService.fetchBlogArticleById(this.articleId()).subscribe((res: FunctionServerResponse) => {
        console.log('res', res);
        this.article.set(res.data as BlogArticle);
        this.spinner.hide();
      });
    }
  }

  imageError() {
    this.showFallback.set(true);
  }

  illustrationError(illustrationIndex: number) {
    this.showIllustrationFallback.set([...this.showIllustrationFallback(), illustrationIndex]);
    console.log('showIllustrationFallback', this.showIllustrationFallback());
  }

  ngOnDestroy(): void {
    this.articleSubscription.unsubscribe();
  }
}
