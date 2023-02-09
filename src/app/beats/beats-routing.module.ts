import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeatsComponent } from './beats/beats.component';


const routes: Routes = [
  {
    path: '',
    component: BeatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeatsRoutingModule { }