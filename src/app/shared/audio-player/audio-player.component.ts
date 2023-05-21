import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicationService } from '../../services/comunication.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {

  currentBeat: any = null;
  currentState: boolean = false;
  audio = new Audio();
  iconVolumen: number = 4
  randomSong: boolean = false;
  @ViewChild('audioPlayer') audioPlayer: any;

  constructor(private comunicationService: ComunicationService) { }

  ngOnInit() {
    this.comunicationService.currentBeatSubject.subscribe((beat: any) => {
      this.currentBeat = beat;
      if (this.currentBeat != null) {
        this.start()
      }
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


  start() {
    this.audio.src = this.currentBeat.audio;
    this.audio.load();
    this.audio.play();
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
  }



}
