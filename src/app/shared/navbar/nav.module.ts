import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    MatListModule,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    MatIconModule,
  ],
  exports: [
    MatListModule,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    MatIconModule,
  ]
})
export class NavModule { }
