import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
