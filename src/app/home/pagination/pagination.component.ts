import { Component, OnInit } from '@angular/core';
import { BeatInterface } from 'src/app/interfaces/beat-response.interface';
import { Pageable } from 'src/app/interfaces/pageable.interface';
import { BeatService } from '../../services/beat.service';
import { Content } from '../../interfaces/pageable.interface';
import { ComunicationService } from 'src/app/services/comunication.service';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import Swal from 'sweetalert2';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Purchase } from 'src/app/interfaces/purchase.interface';
import { PurchasesService } from '../../services/purchases.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  role: string = '';

  results: Content[] = []
  currentCartItems: Content[] = [];

  purchases: Purchase[] = [];
  username: string = '';

  totalElements: number = 0;//cantidad total de items
  size: number = 0;
  numberOfElements: number = 5;//numero de beats por pagina
  actualPage: number = 0;

  spinner: boolean = true;

  constructor(private beatService: BeatService, private comunicationService: ComunicationService, private translate: TranslateService,
    private shoppingCartService: ShoppingCartService, private spinnerService: SpinnerService, private purchasesService: PurchasesService,
    private cookies: CookieService, private authService: AuthService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit(): void {

    this.spinner = true

    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        setTimeout(() => {
          this.role = this.cookies.get('role');
        }, 0.01);
      }
    })

    this.currentCartItems = this.shoppingCartService.beats;

    this.shoppingCartService.totalPrice$.subscribe((totalPrice) => {
      this.changeButtonCart();
    });

    //Cogeremos los beats del servicio al iniciar
    this.getBeats();
  }
  //Cogeremos los beats del servicio 
  getBeats() {
    this.beatService.searchBeats(this.actualPage, this.numberOfElements)
      .subscribe({
        next: (resp) => {
          this.spinner = false

          this.results = resp.content
          this.totalElements = resp.totalElements
          this.changeButtonCart();

          this.username = this.cookies.get('sub')
          if (this.username != '') {
            this.purchasesService.getPurchasesByName(this.username)
              .subscribe({
                next: (resp) => {

                  this.purchases = resp

                  this.results = this.results.filter((beat) => {
                    // Retorna true si el idBeat no está presente en "compras"
                    return !this.purchases.some((compra) => compra.idBeat.idBeat === beat.idBeat);
                  });

                },
                error: (error) => {
                  console.log(error);
                }
              })
          }
        }
      })
  }

  //Para mostrar mas o menos valores
  pageChangeEvent(event: number) {
    this.spinner = true
    this.actualPage = event;
    this.getBeats();
  }

  //Para mostrar mas o menos valores
  changePageSize() {
    this.spinner = true
    this.getBeats();
  }

  //Este método pasará los segundos a minutos en este formato '00:00'
  secondsToString(seconds: number) {
    var minute: string | number = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second: string | number = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
  }

  /**
   * Activaremos el reproductor
   * @param beat 
   */
  audioPlayer(beat: any) {

    this.comunicationService.currentBeatSubject.next(beat);

  }

  /**
 * Añadimos un beat al carrito
 * @param beat 
 */
  addToCart(beat: Content) {

    let wrong = '';
    this.translate.get('An admin is not allowed to make purchases')
      .subscribe(arg => wrong = arg);


    if (this.role != 'ADMIN') {
      this.shoppingCartService.addToCart(beat);
      beat.bought = true;
    }
    else if (this.role == 'ADMIN') {
      Swal.fire({
        icon: 'error',
        text: wrong,
        confirmButtonColor: '#9e1815',
      })
    }
  }

  /**
   * Borraremos del carrito un beat
   * @param beat 
   */
  removeFromCart(beat: Content) {
    this.shoppingCartService.eliminarDelCarrito(beat);
    beat.bought = false;
  }
  /**
   * Este método lo usamos para cambiar el botón del carrito de rojo a verde y viceversa
   */
  changeButtonCart() {
    this.results.forEach(element => {
      let beatIndex = this.currentCartItems.findIndex(cartBeat => cartBeat.idBeat === element.idBeat);
      if (beatIndex == -1) {
        element.bought = false;
      }
      else
        element.bought = true;
    });
  }

  /**
 * Para activar o desactivar el spinner
 * @param value 
 */
  activeSpinner(value: boolean) {
    this.spinnerService.spinnerSubject.next(value);
  }

}
