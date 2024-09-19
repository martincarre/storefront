import { ChangeDetectionStrategy, Component, computed, inject, input, Signal, signal } from '@angular/core';
import { BlogService } from '../blog.service';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { BlogArticle } from './blog-article.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [DatePipe, MatDividerModule, MatButtonModule, MatIconModule, RouterLink, MatCardModule, NgClass],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailsComponent {
  private blogService = inject<BlogService>(BlogService);
  articleId = input.required<string>();
  article: Signal<BlogArticle | null> = signal<BlogArticle | null>(null);
  showFallback = signal<boolean>(false);
  showIllustrationFallback = signal<number[]>([]);

  ngOnInit() {
    if (this.articleId()) {
      this.article = computed(() => {
        return this.blogService.articleList().find(article => article.id === this.articleId()) || null
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
}
