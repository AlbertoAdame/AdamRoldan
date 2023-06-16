import { Component, OnInit } from '@angular/core';
import { Content } from 'src/app/interfaces/pageable.interface';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Purchase } from 'src/app/interfaces/purchase.interface';
import { PurchasesService } from '../../services/purchases.service';
import { AuthService } from '../../services/auth.service';

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

  purchases: Purchase[] = [];
  username: string = ''
  results: any[] = []

  paymentHandler: any = null;

  constructor(private shoppingCartService: ShoppingCartService, private cookies: CookieService, private route: Router,
    private userService: UserService, private spinnerService: SpinnerService, private translate: TranslateService, private language: LanguageService,
    private purchasesService: PurchasesService, private authService: AuthService, private router: Router) { }

  ngOnInit() {

    if (this.language.currentLanguage == undefined)
      this.translate.use('en');
    else {
      this.translate.use(this.language.currentLanguage);
    }

    this.username = this.cookies.get('sub')
    if (this.username != '') {

      let wrong = '';
      this.translate.get("We're sorry, but some beats are no longer available")
        .subscribe(arg => wrong = arg);

      this.purchasesService.getPurchasesByName(this.username)
        .subscribe({
          next: (resp) => {

            this.purchases = resp

            this.results = this.currentCartItems.filter((beat) => {

              return this.purchases.some((compra) => compra.idBeat.idBeat === beat.idBeat);
            });

            if (this.results.length != 0) {
              this.shoppingCartService.clearCart();
              Swal.fire({
                icon: 'error',
                text: wrong,
              })
              this.router.navigateByUrl('home')
            }

          },
          error: (error) => {
            console.log(error);
          }
        })
    }

    let wrong = '';

    this.translate.get('There was an issue with the billing address')
      .subscribe(arg => wrong = arg);

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
              text: wrong
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

    let exist = '';
    let wrong = '';
    this.translate.get('You need to be logged in')
      .subscribe(arg => exist = arg);
    this.translate.get('Address is required')
      .subscribe(arg => wrong = arg);


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
        title: exist
      })
    }

    else if (this.address == '' || this.address == null) {
      this.activeSpinner(false);
      Swal.fire({
        icon: 'error',
        text: wrong,
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

    let success = '';
    let wrong = '';
    this.translate.get('Thank you for your purchase')
      .subscribe(arg => success = arg);
    this.translate.get('Something was wrong')
      .subscribe(arg => wrong = arg);

    this.shoppingCartService.addPurchase(this.address).subscribe(
      {
        next: (resp) => {
          this.activeSpinner(false);
          this.shoppingCartService.clearCart();
          this.route.navigateByUrl('misBeats');
          Swal.fire({
            icon: 'success',
            title: success
          })
        },
        error: (error) => {
          this.activeSpinner(false);
          console.log(error)
          Swal.fire({
            icon: 'error',
            text: wrong
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
    let success = '';
    let wrong = '';
    this.translate.get('Payment with credit card')
      .subscribe(arg => success = arg);
    this.translate.get('Something was wrong')
      .subscribe(arg => wrong = arg);

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
            text: wrong
          })
        }
      });
    };

    paymentHandler.open({
      name: success,
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
