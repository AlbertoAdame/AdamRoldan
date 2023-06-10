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

  constructor(private shoppingCartService: ShoppingCartService, private cookies: CookieService, private route: Router,
    private userService: UserService, private spinnerService: SpinnerService) { }

  ngOnInit() {

    this.role = this.cookies.get('role')

    this.userService.searchUser(this.cookies.get('sub'))
      .subscribe({
        next: (resp) => {

          if (resp) {
            this.address = resp.address;
          }
        }
      })

    this.currentCartItems = this.shoppingCartService.beats;

    this.totalPrice = this.shoppingCartService.getTotalPrice();

    this.shoppingCartService.totalPrice$.subscribe((totalPrice) => {
      this.totalPrice = totalPrice;
    });
  }

  deleteProduct(item: Content) {
    this.shoppingCartService.eliminarDelCarrito(item);
  }

  newPurchase() {
    this.activeSpinner(false);
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

    else if (this.address == '') {
      this.activeSpinner(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Address is required',
      })
    }

    else {

      this.shoppingCartService.addPurchase(this.address).subscribe(
        {
          next: (resp) => {
            this.activeSpinner(false);
            this.shoppingCartService.clearCart();
            this.route.navigateByUrl('home');
            Toast.fire({
              icon: 'success',
              title: 'Gracias por su compra'
            })
          },
          error: (error) => {
            this.activeSpinner(false);
            console.log(error)

          }
        }
      );
    }
  }

  /**
   * Método que controla el margin-botton para el footer
   * @returns 
   */
  getMarginBottom(): string {
    const itemCount = this.currentCartItems.length;

    if (itemCount === 1) {
      return '40em';
    } else if (itemCount === 2) {
      return '35em';
    } else if (itemCount === 3) {
      return '28em';
    } else if (itemCount === 4) {
      return '19em';
    } else if (itemCount === 5) {
      return '13em';
    } else if (itemCount === 6) {
      return '8em';
    } else {
      return '50px'; // Valor predeterminado o para cualquier otro número de elementos
    }
  }

  /**
 * Para activar o desactivar el spinner
 * @param value 
 */
  activeSpinner(value: boolean) {
    this.spinnerService.spinnerSubject.next(value);
  }
}
