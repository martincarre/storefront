import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../blog.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { BlogpostFormComponent } from '../blogpost-form/blogpost-form.component';
import { BlogForm } from '../blogpost-form/new-blog-form.interface';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [RouterLink, BlogpostFormComponent],
  templateUrl: './blogpost-new.component.html',
  styleUrl: './blogpost-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogpostNewComponent {
  private spinner = inject<SpinnerService>(SpinnerService);
  private router = inject<Router>(Router);
  private blogService = inject<BlogService>(BlogService);

  async onSave(event: Event) {
    this.spinner.show();
    // const newArticle = event.target as BlogForm;

    // // Save the newBlog article (e.g., send it to the backend)
    // const saveRes = await this.blogService.saveBlogArticle(newArticle);
    // if (saveRes.success && saveRes.savedArticle) {
    //   alert('Article saved successfully.');
    //   this.spinner.hide();
    //   // TODO: Add correct edit route:
    //   this.router.navigate([`${saveRes.savedArticle.id}`]);
    // }
  }
}