import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeatsComponent } from './beats/beats.component';
import { BeatsRoutingModule } from './beats-routing.module';
import { SongsComponent } from './songs/songs.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    BeatsComponent,
    SongsComponent
  ],
  imports: [
    CommonModule,
    BeatsRoutingModule,
    SharedModule
  ]
})
export class BeatsModule { }
