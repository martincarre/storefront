import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogArticle } from '../../blog-details/blog-article.interface';

@Component({
  selector: 'app-blog-thumbnail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, DatePipe, RouterLink],
  templateUrl: './blog-thumbnail.component.html',
  styleUrl: './blog-thumbnail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogThumbnailComponent {
  blog = input.required<BlogArticle>();
  hover = false;
  showFallback = false;

  imageError() {
    this.showFallback = true;
  }
}
