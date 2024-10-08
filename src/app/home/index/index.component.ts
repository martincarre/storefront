import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SpinnerService } from '../../shared/spinner/spinner.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent {

}
