import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-img-preview',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './img-preview.component.html',
  styleUrl: './img-preview.component.scss'
})
export class ImgPreviewComponent {
  close = output();
  imgSrc = input.required<string>();
  imgAlt = input<string>('default alt text');
}
