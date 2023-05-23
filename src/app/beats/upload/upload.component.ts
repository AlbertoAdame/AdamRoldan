import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { BeatService } from '../../services/beat.service';
import { Genre } from '../../interfaces/genre.interface';
import { Mood } from '../../interfaces/mood.interface';
import { MoodService } from '../../services/mood.service';
import { GenreService } from '../../services/genre.service';
import { ActivatedRoute } from '@angular/router';
import { BeatInterface } from '../../interfaces/beat-response.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  jsonBeat: any = {
    title: '',
    price: null,
    bpm: null,
    time: null
  }

  jsonGenre: Genre = {
    genre: ''
  }

  jsonMood: Mood = {
    mood: ''
  }

  genres: Genre[] = []
  moods: Mood[] = []

  isLoggedIn!: boolean;

  myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: ['', [Validators.required]],
    bpm: ['', [Validators.required]],
    time: ['', [Validators.required]],
    picture: ['', [Validators.required]],
    fileSource: [''],
    genre: ['Drill', [Validators.required]],
    mood: ['Accomplished', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private beatService: BeatService, private moodService: MoodService, private genreService: GenreService, private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit() {
    //Este método nos indica si el token es valido
    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }
    })
    //Obtener moods
    this.moodService.getMoods()
      .subscribe({
        next: (resp) => {
          this.moods = resp;
        }
      })

    //Obtener moods
    this.genreService.getGenres()
      .subscribe({
        next: (resp) => {
          this.genres = resp;
        }
      })
  }


  isValidField(field: string) {
    return this.myForm.controls[field].errors
      && this.myForm.controls[field].touched
  }
  //Convertiremos el file en un fileSource
  onFileChange(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }


  save() {

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched()
      return
    }

    //Pasaremos todos los valores recibidos a los jsons
    this.jsonBeat.title = this.myForm.value.title
    this.jsonBeat.price = this.myForm.value.price
    this.jsonBeat.bpm = this.myForm.value.bpm
    this.jsonBeat.time = this.myForm.value.time

    this.jsonGenre.genre = this.myForm.value.genre

    this.jsonMood.mood = this.myForm.value.mood

    //Llamaremos al servicio para subir el beat
    this.beatService.uploadBeat(this.jsonBeat, this.myForm.get('fileSource')?.value, this.jsonGenre, this.jsonMood)
      .subscribe({
        next: (resp) => {
          if (resp) {
            Swal.fire({
              icon: 'success',
              title: 'Beat was added',
              text: 'You will receive an answer soon'
            }),
              this.myForm.reset()
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Your file is too heavy',

            })
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',

          })
          console.log(error)
        }
      });

  }


}

