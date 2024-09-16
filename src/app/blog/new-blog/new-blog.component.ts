import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBlogComponent implements OnInit {
  constructor() { 
    console.log('NewBlogComponent created');
    console.log('Test')
  }

  ngOnInit(): void {
    console.log('init')
  }
}
