import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './cart/cart.component';
import { RouterModule, Router } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { MatSliderModule } from '@angular/material/slider';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    NavbarComponent,
    NotFoundComponent,
    CartComponent,
    BreadcrumbComponent,
    AudioPlayerComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatSliderModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    NotFoundComponent,
    CartComponent,
    BreadcrumbComponent,
    AudioPlayerComponent,
    FooterComponent
  ]
})
export class SharedModule { }
