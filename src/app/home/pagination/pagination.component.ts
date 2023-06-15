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

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  role: string = '';

  results: Content[] = []
  currentCartItems: Content[] = [];


  totalElements: number = 0;//cantidad total de items
  size: number = 0;
  numberOfElements: number = 5;//numero de beats por pagina
  actualPage: number = 0;

  spinner: boolean = true;

  constructor(private beatService: BeatService, private comunicationService: ComunicationService, private translate: TranslateService,
    private shoppingCartService: ShoppingCartService, private spinnerService: SpinnerService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit(): void {

    this.spinner = true

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

  audioPlayer(beat: any) {

    this.comunicationService.currentBeatSubject.next(beat);

  }

  /**
 * Añadimos un beat al carrito
 * @param beat 
 */
  addToCart(beat: Content) {
    if (this.role != 'ADMIN') {
      this.shoppingCartService.addToCart(beat);
      beat.bought = true;
    }
    else if (this.role == 'ADMIN') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Con el rol de admin no puedes realizar compras',
        confirmButtonColor: '#9e1815',
      })
    }
  }

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
