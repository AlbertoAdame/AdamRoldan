import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeatsComponent } from './beats/beats.component';
import { UploadComponent } from './upload/upload.component';
import { AdminGuard } from '../admin.guard';
import { EditBeatComponent } from './edit-beat/edit-beat.component';


const routes: Routes = [
  {
    path: '',
    component: BeatsComponent
  },
  {
    canActivate: [AdminGuard],
    path: 'upload',
    component: UploadComponent
  },
  {
    canActivate: [AdminGuard],
    path: 'edit/:id',
    component: EditBeatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeatsRoutingModule { }