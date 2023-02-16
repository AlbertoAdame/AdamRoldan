import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeatsComponent } from './beats/beats.component';
import { BeatsRoutingModule } from './beats-routing.module';
import { SongsComponent } from './songs/songs.component';
import { SharedModule } from '../shared/shared.module';
import { BeatService } from '../services/beat.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    BeatsComponent,
    SongsComponent
  ],
  imports: [
    CommonModule,
    BeatsRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule
  ],
  providers:[
    BeatService
  ]
})
export class BeatsModule { }
