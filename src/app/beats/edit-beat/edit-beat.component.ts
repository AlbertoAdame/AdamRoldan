import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { BeatService } from '../../services/beat.service';
import { Genre } from '../../interfaces/genre.interface';
import { Mood } from '../../interfaces/mood.interface';
import { MoodService } from '../../services/mood.service';
import { GenreService } from '../../services/genre.service';
import { BeatInterface } from '../../interfaces/beat-response.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-beat',
  templateUrl: './edit-beat.component.html',
  styleUrls: ['./edit-beat.component.css']
})
export class EditBeatComponent implements OnInit {


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
  beat?: BeatInterface;

  isLoggedIn!: boolean;

  constructor(private fb: FormBuilder, private authService: AuthService, private beatService: BeatService, private moodService: MoodService, private genreService: GenreService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }
    })

    let id = this.route.snapshot.params['id']
    this.beatService.getBeat(id)
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.beat = resp;
            this.myForm.reset({
              title: resp.title,
              price: resp.price,
              time: resp.time,
              bpm: resp.bpm
            })

          }

        }
      })

    this.moodService.getMoods()
      .subscribe({
        next: (resp) => {
          this.moods = resp;
        }
      })

    this.genreService.getGenres()
      .subscribe({
        next: (resp) => {
          this.genres = resp;
        }
      })



  }

  myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: ['', [Validators.required]],
    bpm: ['', [Validators.required]],
    time: ['', [Validators.required]],
    genre: ['Drill', [Validators.required]],
    mood: ['Accomplished', [Validators.required]],
    picture: [''],
    fileSource: ['']
  })

  isValidField(field: string) {
    return this.myForm.controls[field].errors
      && this.myForm.controls[field].touched
  }

  onFileChange(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }


  save() {
    console.log(this.myForm)

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched()
      return
    }

    this.jsonBeat.title = this.myForm.value.title
    this.jsonBeat.price = this.myForm.value.price
    this.jsonBeat.bpm = this.myForm.value.bpm
    this.jsonBeat.time = this.myForm.value.time

    this.jsonGenre.genre = this.myForm.value.genre

    this.jsonMood.mood = this.myForm.value.mood

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
              text: 'Hubo un error al subir su archivo',

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
