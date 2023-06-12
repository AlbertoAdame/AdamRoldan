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
  currentCartItems: Content[] = [];
  genres: Genre[] = []

  //Necesitamos esto para el datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  vetanaWidth: boolean = false;


  constructor(private beatService: BeatService, private authService: AuthService, private cookies: CookieService, private genreService: GenreService,
    private comunicationService: ComunicationService, private translate: TranslateService, private shoppingCartService: ShoppingCartService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit(): void {

    if (window.innerWidth < 1375) {
      this.vetanaWidth = true
    }

    this.currentCartItems = this.shoppingCartService.beats;

    this.shoppingCartService.totalPrice$.subscribe((totalPrice) => {
      this.changeButtonCart();
    });

    //recibiremos los beats llamando al servicio
    this.beatService.searchBeats(0, 200)
      .subscribe({
        next: (resp) => {

          this.results = resp.content
          this.dtTrigger.next(this.results)

          this.changeButtonCart();
        },
        error: (error) => {
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

    // this.beatService.searchBeatsPageable(0, 200, "date", '')

    this.authService.isAuthenticated();
    this.role = this.cookies.get('role')

    const self = this;

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
    if (window.innerWidth < 1375) {
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
    this.beatService.searchBeats(0, 200)
      .subscribe({
        next: (resp) => {
          this.results = resp.content

          this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destruir la DataTable actual
            dtInstance.destroy();

            // Reinicializar la DataTable
            this.dtTrigger.next(this.results);
          });

        },
        error: (error) => {
          console.log(error);

        }
      })

  }

  //Al pulsar el botón de borrar beats hará esto
  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.beatService.deleteBeat(id)
          .subscribe(
            {
              next: (resp) => {
                this.refreshBeats();
                console.log(resp)
              },
              error: (error) => {
                console.log(error)
              }
            }
          );
      }
    })
  }


  //Al pulsar el botón de añadir generos nos mostrará una lista con los géneros, y una vez elegido los añadirá 
  onAddGenre(id: number) {
    //Reduce es más avanzado, y básicamente lo que hace es darle un formato en concreto a los valores del array que le facilitamos
    const genresObject = this.genres.reduce((obj, item) =>
      Object.assign(obj, { [item.genre]: item.genre }), {});
    // console.log(genresObject);

    this.genreService.getGenresNoAdded(id).subscribe({
      next: (resp: any) => {
        this.genres = resp;
        let assignedGenres = 6 - this.genres.length;
        console.log(assignedGenres);

        if (assignedGenres < 3) {
          Swal.fire({
            title: 'Select Your New Genre',
            input: 'select',
            inputOptions: this.genres.reduce(
              (obj, item) => Object.assign(obj, { [item.genre]: item.genre }), {}),
            inputPlaceholder: '-- Select genre --',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              this.addGenre(id, result.value);
              Swal.fire({
                icon: 'success',
                html: 'You selected: ' + result.value
              });
            }
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'No puedes añadir mas de 3 géneros',
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
    this.genreService.addBeatGenre(idBeat, genre)
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.refreshBeats();
          }

          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Genre wasnt added',

            })
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This genre already exists',
          })
        }
      });
  }
  //Cuando pulsemos el boton de borrar género de un beat en concreto lo borrará
  onDeleteGenre(idBeat: number, genre: string) {
    this.genreService.getGenresNoAdded(idBeat).subscribe({
      next: (resp: any) => {
        this.genres = resp;
        let assignedGenres = 6 - this.genres.length;

        if (assignedGenres > 1) {
          this.genreService.deleteBeatGenre(idBeat, genre)
            .subscribe(
              {
                next: (resp) => {
                  this.refreshBeats();
                },
                error: (error) => {
                  console.log(error)
                }
              }
            );
        }
        else {
          this.refreshBeats();
          Swal.fire({
            icon: 'error',
            text: 'No puedes quitar todos los géneros',
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


}
