import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { BeatService } from '../../services/beat.service';
import { Content } from '../../interfaces/pageable.interface';
import * as $ from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../interfaces/genre.interface';
import { ComunicationService } from '../../services/comunication.service';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { DataTableDirective } from 'angular-datatables';
import { SpinnerService } from 'src/app/services/spinner.service';
import { PurchasesService } from '../../services/purchases.service';
import { Purchase } from 'src/app/interfaces/purchase.interface';


@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dataTableElement!: DataTableDirective;

  flag: boolean = false;
  role: string = '';

  results: Content[] = [];
  purchases: Purchase[] = [];
  currentCartItems: Content[] = [];
  genres: Genre[] = []

  //Necesitamos esto para el datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  vetanaWidth: boolean = false;
  vetanaWidthCross: boolean = false;
  username: string = '';


  constructor(private beatService: BeatService, private authService: AuthService, private cookies: CookieService, private genreService: GenreService,
    private comunicationService: ComunicationService, private translate: TranslateService, private shoppingCartService: ShoppingCartService,
    private spinnerService: SpinnerService, private purchasesService: PurchasesService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit(): void {
    //Pondremos esto para que no de error
    setTimeout(() => {
      this.activeSpinner(true);
    }, 0.01);

    //Para controlar ciertos elementos con  las responsividad
    if (window.innerWidth < 1375) {
      this.vetanaWidth = true
    }

    //Para controlar ciertos elementos con  las responsividad
    if (window.innerWidth < 1090) {
      this.vetanaWidthCross = true
    }

    this.currentCartItems = this.shoppingCartService.beats;

    //Si cambia el precio cambiaremos el carrito
    this.shoppingCartService.totalPrice$.subscribe((totalPrice) => {
      this.changeButtonCart();
    });

    //recibiremos los beats llamando al servicio
    this.beatService.searchBeats(0, 200)
      .subscribe({
        next: (resp) => {

          this.activeSpinner(false);

          this.results = resp.content

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

                  this.dtTrigger.next(this.results)

                },
                error: (error) => {
                  console.log(error);
                }
              })
          }

          else {
            this.dtTrigger.next(this.results)
          }
        },
        error: (error) => {
          this.activeSpinner(false);
          console.log(error);

        }
      })

    //Opciones necesarias para el datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 200,
      processing: true,
      responsive: true
    };

    this.authService.isAuthenticated();
    this.role = this.cookies.get('role')

    // const self = this;
    // 
    //Esto lo tendremos que hacer ya que cuando hemos hecho la dataTable responsive los botones han dejado de funcionar
    // $(document).ready(function () {
    //   $('#my-table tbody').on('click', '.cartButton', function () {
    //     const parametro = $(this).data('parametro');

    //     self.beatService.getBeat(parametro)
    //       .subscribe({
    //         next: (resp) => {
    //           console.log(resp);

    //           self.addToCart(resp);
    //         },
    //         error: (error) => {
    //           console.log(error);

    //         }
    //       })
    //   });
    // });


  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {

    if (window.innerWidth < 1090) {
      this.vetanaWidthCross = true

    } else {
      this.vetanaWidthCross = false
    }

    if (window.innerWidth < 1590) {
      this.vetanaWidth = true

    } else {
      this.vetanaWidth = false
    }
  }

  //Destruiremos la promesa de la datatable
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  //Lo dejaremos aqui para el futuro
  // get beats(): Pageable {
  //   // console.log(this.beatService.beats);

  //   return this.beatService.beats
  // }

  //Este método pasará los segundos a minutos en este formato '00:00'
  secondsToString(seconds: number) {
    var minute: string | number = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second: string | number = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
  }

  refreshBeats() {
    this.activeSpinner(true);
    this.beatService.searchBeats(0, 200)
      .subscribe({
        next: (resp) => {
          this.activeSpinner(false);
          this.results = resp.content

          this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destruir la DataTable actual
            dtInstance.destroy();

            // Reinicializar la DataTable
            this.dtTrigger.next(this.results);
          });
        },
        error: (error) => {
          this.activeSpinner(false);
          console.log(error);

        }
      })

  }

  //Al pulsar el botón de borrar beats hará esto
  onDelete(id: number) {

    let sure = '';
    let revert = '';
    this.translate.get('Are you sure?')
      .subscribe(arg => sure = arg);
    this.translate.get("You won't be able to revert this!")
      .subscribe(arg => revert = arg);

    Swal.fire({
      title: sure,
      text: revert,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      this.activeSpinner(true);
      if (result.isConfirmed) {
        this.beatService.deleteBeat(id)
          .subscribe(
            {
              next: (resp) => {
                this.activeSpinner(false);
                this.refreshBeats();
                console.log(resp)
              },
              error: (error) => {
                this.activeSpinner(false);
                console.log(error)
              }
            }
          );
      }
      else {
        this.activeSpinner(false);
      }
    })
  }


  //Al pulsar el botón de añadir generos nos mostrará una lista con los géneros, y una vez elegido los añadirá 
  onAddGenre(id: number) {

    let selectNewGenre = '';
    let selectGenre = '';
    let selected = '';
    let max = '';

    this.translate.get('selectNewGenre')
      .subscribe(arg => selectNewGenre = arg);
    this.translate.get('Select genre')
      .subscribe(arg => selectGenre = arg);
    this.translate.get('You selected')
      .subscribe(arg => selected = arg);
    this.translate.get('You cannot add more than 3 genres.')
      .subscribe(arg => max = arg);

    //Reduce es más avanzado, y básicamente lo que hace es darle un formato en concreto a los valores del array que le facilitamos
    const genresObject = this.genres.reduce((obj, item) =>
      Object.assign(obj, { [item.genre]: item.genre }), {});
    // console.log(genresObject);

    this.genreService.getGenresNoAdded(id).subscribe({
      next: (resp: any) => {
        this.genres = resp;
        let assignedGenres = 6 - this.genres.length;

        if (assignedGenres < 3) {
          Swal.fire({
            title: selectNewGenre,
            input: 'select',
            inputOptions: this.genres.reduce(
              (obj, item) => Object.assign(obj, { [item.genre]: item.genre }), {}),
            inputPlaceholder: '-- ' + selectGenre + ' --',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              this.addGenre(id, result.value);
              Swal.fire({
                icon: 'success',
                html: selected + ': ' + result.value
              });
            }
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            text: max,
          })
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  //Cuando el método superior acabe satisfactoriamente llamaremos al servicio y añadiremos un género
  addGenre(idBeat: number, genre: string) {

    let wrong = '';
    let exist = '';
    this.translate.get("Genre wasn't added")
      .subscribe(arg => wrong = arg);
    this.translate.get('This genre already exists')
      .subscribe(arg => exist = arg);

    this.activeSpinner(true);
    this.genreService.addBeatGenre(idBeat, genre)
      .subscribe({
        next: (resp) => {
          this.activeSpinner(false);
          if (resp) {
            this.refreshBeats();
          }

          else {
            this.activeSpinner(false);
            Swal.fire({
              icon: 'error',
              text: wrong,

            })
          }
        },
        error: (error) => {
          this.activeSpinner(false);
          Swal.fire({
            icon: 'error',
            text: exist,
          })
        }
      });
  }
  //Cuando pulsemos el boton de borrar género de un beat en concreto lo borrará
  onDeleteGenre(idBeat: number, genre: string) {

    let wrong = '';
    this.translate.get('You cannot remove all the genres.')
      .subscribe(arg => wrong = arg);
    this.activeSpinner(true);
    this.genreService.getGenresNoAdded(idBeat).subscribe({
      next: (resp: any) => {
        this.genres = resp;
        let assignedGenres = 6 - this.genres.length;

        if (assignedGenres > 1) {
          this.genreService.deleteBeatGenre(idBeat, genre)
            .subscribe(
              {
                next: (resp) => {
                  this.activeSpinner(false);
                  this.refreshBeats();
                },
                error: (error) => {
                  this.activeSpinner(false);
                  console.log(error)
                }
              }
            );
        }
        else {
          this.refreshBeats();
          Swal.fire({
            icon: 'error',
            text: wrong,
          })
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  /**
   * Utilizaremos este método para mandar el beat al reproductor
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
    this.shoppingCartService.addToCart(beat);
    beat.bought = true;
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
