import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BeatService } from '../../services/beat.service';
import { Content, Pageable } from '../../interfaces/pageable.interface';
import { Page } from 'ngx-pagination';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../interfaces/genre.interface';


@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit, OnDestroy {

  flag: boolean = false;
  role: string = ''

  results: Content[] = [];
  genres: Genre[] = []

  //Necesitamos esto para el datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>()

  constructor(private beatService: BeatService, private authService: AuthService, private cookies: CookieService, private genreService: GenreService) {
  }

  ngOnInit(): void {
    //Para el datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 200,
      processing: true
    };
    //recibiremos los beats llamando al servicio
    this.beatService.searchBeats(0, 200)
      .subscribe({
        next: (resp) => {

          this.results = resp.content
          this.dtTrigger.next(this.results)
        },
        error: (error) => {
          console.log(error);

        }
      })


    // this.beatService.searchBeatsPageable(0, 200, "date", '')

    this.authService.isAuthenticated();
    this.role = this.cookies.get('role')

    //obtenemos todos lo géneros
    this.genreService.getGenres()
      .subscribe({
        next: (resp) => {
          this.genres = resp
        },
        error: (error) => {
          console.log(error);
        }
      })

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
                console.log(resp)
              },
              error: (error) => {
                console.log(error)
              }
            }
          );
        window.location.reload()
      }
    })
  }
  //Al pulsar el botón de añadir beats hará esto
  onAddGenre(id: number) {
    Swal.fire({
      title: 'Select Your New Genre',
      input: 'select',
      inputOptions: {//esto mirar para mejorarlo, pq no puedo hacer un for de genres[]
        'Drill': 'Drill',
        'Electronic': 'Electronic',
        'Folky': 'Folky',
        'Jazz': 'Jazz',
        'Trap': 'Trap'
      },
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

  //Cuando el método superior acabe satisfactoriamente llamaremos al servicio y añadiremos un género
  addGenre(idBeat: number, genre: string) {
    this.genreService.addBeatGenre(idBeat, genre)
      .subscribe({
        next: (resp) => {
          if (resp) {
            window.location.reload()
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
        this.genreService.deleteBeatGenre(idBeat, genre)
          .subscribe(
            {
              next: (resp) => {
                console.log(resp)
              },
              error: (error) => {
                console.log(error)
              }
            }
          );
        //es importante que recargemos la página para que se vean reflejados los cambios
        window.location.reload()
      }
    })
  }
}
