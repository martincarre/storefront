import { Component, input } from '@angular/core';
import { BlogThumbnail } from '../blog-thumbnail.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-thumbnail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, DatePipe],
  templateUrl: './blog-thumbnail.component.html',
  styleUrl: './blog-thumbnail.component.scss'
})
export class BlogThumbnailComponent {
  blog = input.required<BlogThumbnail>();
  hover = false;
  showFallback = false;

  imageError() {
    console.log('Image error: True');
    this.showFallback = true;
  }
}
