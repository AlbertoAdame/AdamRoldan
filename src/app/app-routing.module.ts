import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { RolGuardGuard } from './rol-guard.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'login',

    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'beats',
    loadChildren: () => import('./beats/beats.module').then(m => m.BeatsModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
  },
  {
    canActivate: [RolGuardGuard],
    path: 'editUser',
    loadChildren: () => import('./edit-user/edit-user.module').then(m => m.EditUserModule)
  },
  {
    path: 'shoppingCart',
    loadChildren: () => import('./shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    canActivate: [RolGuardGuard],
    path: 'misBeats',
    loadChildren: () => import('./mis-beats/mis-beats.module').then(m => m.MisBeatsModule)
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
