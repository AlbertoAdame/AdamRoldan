import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisBeatsRoutingModule } from './mis-beats-routing.module';
import { MisBeatsComponent } from './mis-beats/mis-beats.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MisBeatsComponent
  ],
  imports: [
    CommonModule,
    MisBeatsRoutingModule,
    SharedModule
  ]
})
export class MisBeatsModule { }
