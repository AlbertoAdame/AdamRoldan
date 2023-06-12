import { Component, OnInit } from '@angular/core';
import { Content } from 'src/app/interfaces/pageable.interface';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  currentCartItems: Content[] = [];
  role: string = '';
  totalPrice: string = "0.00";
  address: string = "";

  paymentHandler: any = null;

  constructor(private shoppingCartService: ShoppingCartService, private cookies: CookieService, private route: Router,
    private userService: UserService, private spinnerService: SpinnerService) { }

  ngOnInit() {

    this.invokeStripe();

    this.role = this.cookies.get('role')

    this.userService.searchUser(this.cookies.get('sub'))
      .subscribe({
        next: (resp) => {

          if (resp) {
            this.address = resp.address;
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong with the address!'
            })
          }
        }
      })

    this.currentCartItems = this.shoppingCartService.beats;

    this.totalPrice = this.shoppingCartService.getTotalPrice();

    this.shoppingCartService.totalPrice$.subscribe((totalPrice) => {
      this.totalPrice = totalPrice;
    });
  }

  comprobacionesPurchase() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    if (this.role == '') {
      this.activeSpinner(false);
      this.route.navigateByUrl('login');
      Toast.fire({
        icon: 'warning',
        title: 'Signed is required'
      })
    }

    else if (this.address == '' || this.address == null) {
      this.activeSpinner(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Address is required',
      })
    }

    else {
      this.makePayment();
    }
  }

  deleteProduct(item: Content) {
    this.shoppingCartService.eliminarDelCarrito(item);
  }

  newPurchase() {
    this.shoppingCartService.addPurchase(this.address).subscribe(
      {
        next: (resp) => {
          this.activeSpinner(false);
          this.shoppingCartService.clearCart();
          this.route.navigateByUrl('home');
          Swal.fire({
            icon: 'success',
            title: 'Gracias por su compra'
          })
        },
        error: (error) => {
          this.activeSpinner(false);
          console.log(error)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      }
    );
  }

  /**
 * Para activar o desactivar el spinner
 * @param value 
 */
  activeSpinner(value: boolean) {
    this.spinnerService.spinnerSubject.next(value);
  }

  makePayment() {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51NG2j9CMke1RcMKngfxV72PHxCyziVd0fvtp3WHs2foTu1gYZHRi44Fd6f0wTrad4mxxPM94uB1Ca5neYT1SANa600QYNC1nUi',
      locale: 'auto',
      token: function (stripeToken: any) {
        // console.log(stripeToken);
        paymentstripe(stripeToken);
      },
    });

    const paymentstripe = (stripeToken: any) => {
      this.activeSpinner(true);
      this.shoppingCartService.makePayment(stripeToken, this.totalPrice).subscribe((data: any) => {
        // console.log(data);
        if (data.data === "success") {
          this.newPurchase();
        }
        else {
          this.activeSpinner(false);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      });
    };

    paymentHandler.open({
      name: 'Pago con tarjeta',
      description: 'Powered by Stripe',
      amount: parseFloat(this.totalPrice) * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51NG2j9CMke1RcMKngfxV72PHxCyziVd0fvtp3WHs2foTu1gYZHRi44Fd6f0wTrad4mxxPM94uB1Ca5neYT1SANa600QYNC1nUi',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }
}
