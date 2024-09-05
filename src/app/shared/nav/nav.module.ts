import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { HasRoleDirective } from '../auth/has-role.directive';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    MatListModule,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    MatIconModule,
    HasRoleDirective,
  ],
  exports: [
    MatListModule,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    MatIconModule,
    HasRoleDirective,
  ]
})
export class NavModule { }
