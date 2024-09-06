import { Component, inject, OnInit } from '@angular/core';
import { SpinnerService } from '../../shared/spinner/spinner.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  private spinnerService = inject<SpinnerService>(SpinnerService);
  constructor() { }

  ngOnInit(): void {
    this.spinnerService.show();
    setTimeout(() => {
      console.log('test');
      this.spinnerService.hide();
    }, 5000);
  }

}
