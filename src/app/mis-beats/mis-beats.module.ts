import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MisBeatsRoutingModule } from './mis-beats-routing.module';
import { MisBeatsComponent } from './mis-beats/mis-beats.component';
import { SharedModule } from '../shared/shared.module';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MatDividerModule } from '@angular/material/divider';
import { DateFormatPipe } from '../pipes/date.format.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    MisBeatsComponent,
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    MisBeatsRoutingModule,
    SharedModule,
    AngularFireStorageModule,
    MatDividerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: []
})
export class MisBeatsModule { }
