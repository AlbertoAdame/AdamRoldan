import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './cart/cart.component';



@NgModule({
  declarations: [
    NavbarComponent,
    NotFoundComponent,
    CartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    NotFoundComponent,
    CartComponent
  ]
})
export class SharedModule { }
