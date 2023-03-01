import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeatsComponent } from './beats/beats.component';
import { BeatsRoutingModule } from './beats-routing.module';
import { SongsComponent } from './songs/songs.component';
import { SharedModule } from '../shared/shared.module';
import { BeatService } from '../services/beat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './upload/upload.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    BeatsComponent,
    SongsComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    BeatsRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers:[
    BeatService
  ]
})
export class BeatsModule { }
