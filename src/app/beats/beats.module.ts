import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeatsComponent } from './beats/beats.component';
import { BeatsRoutingModule } from './beats-routing.module';



@NgModule({
  declarations: [
    BeatsComponent
  ],
  imports: [
    CommonModule,
    BeatsRoutingModule
  ]
})
export class BeatsModule { }
