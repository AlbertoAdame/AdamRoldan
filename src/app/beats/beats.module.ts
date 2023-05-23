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
import { EditBeatComponent } from './edit-beat/edit-beat.component';
import { DataTablesModule } from 'angular-datatables';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';




@NgModule({
  declarations: [
    BeatsComponent,
    SongsComponent,
    UploadComponent,
    EditBeatComponent
  ],
  imports: [
    CommonModule,
    BeatsRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    DataTablesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    BeatService
  ]
})
export class BeatsModule { }
