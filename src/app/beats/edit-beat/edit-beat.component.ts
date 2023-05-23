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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-beat',
  templateUrl: './edit-beat.component.html',
  styleUrls: ['./edit-beat.component.css']
})
export class EditBeatComponent implements OnInit {

  moods: Mood[] = []
  beat?: BeatInterface;
  id: string = ''
  mood?: Mood

  isLoggedIn!: boolean;

  constructor(private fb: FormBuilder, private authService: AuthService, private beatService: BeatService, private moodService: MoodService, private translate: TranslateService, private route: ActivatedRoute) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit() {
    //Este método nos indica si el token es valido
    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }
    })

    this.id = this.route.snapshot.params['id']
    this.id = this.id.toString()
    //Llamaremos al servicio para obtener todos los beats del parámetro que hemos recibido arriba
    this.beatService.getBeat(this.id)
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.myForm.reset({
              title: resp.title,
              price: resp.price,
              time: resp.time,
              bpm: resp.bpm,
              mood: resp.mood.mood
            })

          }

        }
      })
    //Llamaremos al servicio para obtener todos los moods
    this.moodService.getMoods()
      .subscribe({
        next: (resp) => {
          this.moods = resp;
        }
      })

  }

  myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: ['', [Validators.required]],
    bpm: ['', [Validators.required]],
    time: ['', [Validators.required]],
    mood: ['', [Validators.required]]
  })

  isValidField(field: string) {
    return this.myForm.controls[field].errors
      && this.myForm.controls[field].touched
  }


  save() {

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return
    }

    //Una vez introducido los datos llamaremos al servicio y editará
    this.beatService.editBeat(this.id, this.myForm.value.title, this.myForm.value.price, this.myForm.value.bpm, this.myForm.value.time, this.myForm.value.mood)
      .subscribe({
        next: (resp) => {
          if (resp) {
            Swal.fire({
              icon: 'success',
              title: 'Beat was edited'
            }),
              this.myForm.reset()
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',

            })
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',

          })
          // console.log(error)
        }
      });

  }


}
