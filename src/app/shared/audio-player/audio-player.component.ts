import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicationService } from '../../services/comunication.service';
import Swal from 'sweetalert2';
import { SpinnerService } from '../../services/spinner.service';
import { Content } from 'src/app/interfaces/pageable.interface';
import { BeatService } from 'src/app/services/beat.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {

  results: Content[] = [];
  currentBeat: any = null;

  currentState: boolean = false;
  audio = new Audio();
  iconVolumen: number = 4
  randomSong: boolean = false;
  indiceActual: number = 0;

  spinner: boolean = false;

  constructor(private comunicationService: ComunicationService, private spinnerService: SpinnerService, private beatService: BeatService) { }

  ngOnInit() {

    this.spinnerService.spinnerSubject.subscribe((value: any) => {
      this.spinner = value;
    });

    this.comunicationService.currentBeatSubject.subscribe((beat: any) => {
      this.spinner = true
      this.currentBeat = beat;
      if (this.currentBeat != null) {
        this.start()
      }
    });

    this.audio.addEventListener('ended', () => {
      this.nextSong();
    });
  }

  volume = 75; // Valor inicial del volumen
  currentPosition = 0; // Posición de reproducción actual
  totalDuration = 0; // Duración total de la canción

  changeVolume(): void {
    this.audio.volume = this.volume / 100;
    if (this.volume == 0)
      this.iconVolumen = 1
    else if (this.volume <= 33)
      this.iconVolumen = 2
    else if (this.volume <= 66)
      this.iconVolumen = 3
    else
      this.iconVolumen = 4
  }

  ordenRandom() {
    this.randomSong = !this.randomSong
  }

  hacerBucle() {
    this.audio.loop = !this.audio.loop;
  }

  seekToPosition(): void {
    this.audio.currentTime = this.currentPosition;
  }

  //Esto hay que tocarlo para que muestre los minutos
  formatLabel(value: number): string {
    var minute: string | number = Math.floor((value / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second: string | number = value % 60;
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
  }

  pause() {
    if (this.currentState == false) {
      this.currentState = true
      this.audio.play();
    }

    else {
      this.currentState = false
      this.audio.pause();
    }
  }

  changeIcon() {
    this.currentState = true
  }


  start() {
    if (this.currentBeat.audio == null) {
      this.audio.src = this.currentBeat.audio;
      this.audio.load();
      Swal.fire({
        icon: 'error',
        title: 'Lo sentimos',
        text: 'Audio no encontrado'
      })
    }
    else {

      if (this.results.length == 0) {
        //recibiremos los beats llamando al servicio
        this.beatService.searchBeats(0, 200)
          .subscribe({
            next: (resp) => {

              this.results = resp.content

              this.currentState = true;
              this.audio.src = this.currentBeat.audio;
              this.audio.addEventListener('canplaythrough', () => {
                this.spinner = false,
                  this.audio.play();
              });
              this.audio.load();

              this.audio.volume = this.volume / 100;
              this.totalDuration = this.currentBeat.time
              this.audio.loop = false;
              this.audio.addEventListener('timeupdate', () => {
                this.currentPosition = this.audio.currentTime;
              });

              //este temporizador es necesario para que cargue el botón de play por primera vez
              setTimeout(() => {
                this.currentState = true
              }, 1);
            },
            error: (error) => {
              console.log(error);

            }
          })

      }
      else {
        this.currentState = true;
        this.audio.src = this.currentBeat.audio;
        this.audio.addEventListener('canplaythrough', () => {
          this.spinner = false,
            this.audio.play();
        });
        this.audio.load();
        this.audio.volume = this.volume / 100;
        this.totalDuration = this.currentBeat.time
        this.audio.loop = false;
        this.audio.addEventListener('timeupdate', () => {
          this.currentPosition = this.audio.currentTime;
        });
      }
    }
  }

  nextSong() {
    this.currentState = true;
    if (this.indiceActual < this.results.length - 1) {
      if (this.randomSong) {
        this.indiceActual = Math.floor(Math.random() * (this.results.length - 1));

      }
      else {
        this.indiceActual++;
      }
      this.currentBeat = this.results[this.indiceActual];
      this.start();
    } else {
      this.indiceActual = 0;
    }
  }

  previousSong() {
    this.currentState = true;
    if (this.indiceActual > 0) {
      this.indiceActual--;
      this.currentBeat = this.results[this.indiceActual];
      this.start();
    } else {
      this.indiceActual = 0;
      this.currentBeat = this.results[this.indiceActual];
      this.start();
    }
  }
}
