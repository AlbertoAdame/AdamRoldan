import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { BeatService } from '../../services/beat.service';
import { Genre } from '../../interfaces/genre.interface';
import { Mood } from '../../interfaces/mood.interface';
import { MoodService } from '../../services/mood.service';
import { GenreService } from '../../services/genre.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../services/spinner.service';

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
    time: null,
    audio: ''
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
  audio = new Audio();


  myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: ['', [Validators.required]],
    bpm: ['', [Validators.required]],
    time: [''],
    picture: ['', [Validators.required]],
    audio: ['', [Validators.required]],
    fileSource: [''],
    genre: ['Drill', [Validators.required]],
    mood: ['Accomplished', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private beatService: BeatService, private moodService: MoodService,
    private genreService: GenreService, private translate: TranslateService, private spinnerService: SpinnerService, private storage: AngularFireStorage) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit() {

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

  //Este método subirá el archivo de audio a fireBase
  uploadAudio($event: any) {
    this.activeSpinner(true);
    const file = $event.target.files[0];

    const audioRef = this.storage.ref(file.name);
    const metadata = {
      contentType: file.type
    };

    audioRef.put(file, metadata)
      .then((snapshot) => {
        this.activeSpinner(false);
        audioRef.getDownloadURL()
          .subscribe((downloadURL) => {
            this.myForm.value.audio = downloadURL;
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }


  save() {

    let success = '';
    let heavy = '';
    let wrong = '';
    let exist = '';
    this.translate.get('Beat was added')
      .subscribe(arg => success = arg);
    this.translate.get('This title already exist')
      .subscribe(arg => heavy = arg);
    this.translate.get('Something was wrong')
      .subscribe(arg => wrong = arg);
    this.translate.get('A beat with this name already exists')
      .subscribe(arg => exist = arg);

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched()
      return
    }
    this.activeSpinner(true);

    this.audio.src = this.myForm.value.audio;

    this.audio.load()
    //Para detectar la duración del beat
    if (this.myForm.value.audio != '') {
      this.audio.addEventListener('loadedmetadata', () => {
        this.jsonBeat.time = this.audio.duration
        this.jsonBeat.audio = this.myForm.value.audio
        this.jsonBeat.title = this.myForm.value.title
        this.jsonBeat.price = this.myForm.value.price
        this.jsonBeat.bpm = this.myForm.value.bpm

        this.jsonGenre.genre = this.myForm.value.genre

        this.jsonMood.mood = this.myForm.value.mood

        //Llamaremos al servicio para subir el beat
        this.beatService.uploadBeat(this.jsonBeat, this.myForm.get('fileSource')?.value, this.jsonGenre, this.jsonMood)
          .subscribe({
            next: (resp) => {
              if (resp == true) {
                this.activeSpinner(false);
                Swal.fire({
                  icon: 'success',
                  text: success
                }),
                  this.myForm.reset()
              }
              else {
                this.activeSpinner(false);
                Swal.fire({
                  icon: 'error',
                  text: heavy,

                })
              }
            },
            error: (error) => {
              this.activeSpinner(false);
              Swal.fire({
                icon: 'error',
                text: wrong,

              })
              console.log(error)
            }
          });
      });
    }
    else {
      this.jsonBeat.time = this.audio.duration
      this.jsonBeat.audio = this.myForm.value.audio
      this.jsonBeat.title = this.myForm.value.title
      this.jsonBeat.price = this.myForm.value.price
      this.jsonBeat.bpm = this.myForm.value.bpm

      this.jsonGenre.genre = this.myForm.value.genre

      this.jsonMood.mood = this.myForm.value.mood

      //Llamaremos al servicio para subir el beat
      this.beatService.uploadBeat(this.jsonBeat, this.myForm.get('fileSource')?.value, this.jsonGenre, this.jsonMood)
        .subscribe({
          next: (resp) => {
            if (resp == true) {
              this.activeSpinner(false);
              Swal.fire({
                icon: 'success',
                text: success
              }),
                this.myForm.reset()
            }
            else if (resp.error.status == 'CONFLICT') {
              this.activeSpinner(false);
              Swal.fire({
                icon: 'error',
                text: exist,

              })
            }

            else if (resp.error.message == 'Maximum upload size exceeded') {
              this.activeSpinner(false);
              Swal.fire({
                icon: 'error',
                text: heavy,

              })
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
              text: wrong,

            })
            console.log(error)
          }
        });
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

