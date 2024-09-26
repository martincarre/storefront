import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { BlogService } from '../blog.service';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { BlogArticle } from './blog-article.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Timestamp } from 'firebase/firestore';
import { FunctionServerResponse } from '../../shared/function-server-response.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [DatePipe, MatDividerModule, MatButtonModule, MatIconModule, RouterLink, MatCardModule, NgClass],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  private blogService = inject<BlogService>(BlogService);
  private articleSubscription: Subscription = new Subscription();
  articleId = input.required<string>();
  article = signal<BlogArticle | null>(null);
  showFallback = signal<boolean>(false);
  showIllustrationFallback = signal<number[]>([]);

  ngOnInit() {
    if (this.articleId()) {
      this.articleSubscription = this.blogService.fetchBlogArticleById(this.articleId()).subscribe((res: FunctionServerResponse) => {
        this.article.set(res.data as BlogArticle);
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
