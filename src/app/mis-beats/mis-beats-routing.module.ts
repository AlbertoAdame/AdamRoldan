import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisBeatsComponent } from './mis-beats/mis-beats.component';

const routes: Routes = [{ path: '', component: MisBeatsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisBeatsRoutingModule { }
