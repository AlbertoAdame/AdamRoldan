import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';


@NgModule({
  declarations: [
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule,
    FormsModule,
    MatDividerModule,
    SharedModule,
    HttpClientModule,
    NgxStripeModule.forRoot('pk_test_51NG2j9CMke1RcMKngfxV72PHxCyziVd0fvtp3WHs2foTu1gYZHRi44Fd6f0wTrad4mxxPM94uB1Ca5neYT1SANa600QYNC1nUi')
  ]
})
export class ShoppingCartModule { }
