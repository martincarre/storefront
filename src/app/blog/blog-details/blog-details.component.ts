import { ChangeDetectionStrategy, Component, computed, inject, input, Signal, signal } from '@angular/core';
import { BlogService } from '../blog.service';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { BlogArticle } from './blog-article.class';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [DatePipe, MatDividerModule, MatIconModule, RouterLink, MatCardModule, NgClass],
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
        return this.blogService.blogList().find(article => article.id === this.articleId()) || null
      });
    }
  }

  imageError() {
    console.log('thumb error');
    this.showFallback.set(true);
  }

  illustrationError(illustrationIndex: number) {
    console.log('illustration error');
    this.showIllustrationFallback.set([...this.showIllustrationFallback(), illustrationIndex]);
    console.log('showIllustrationFallback', this.showIllustrationFallback());
  }
}
