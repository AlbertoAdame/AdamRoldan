import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeatsComponent } from './beats/beats.component';
import { UploadComponent } from './upload/upload.component';


const routes: Routes = [
  {
    path: '',
    component: BeatsComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeatsRoutingModule { }