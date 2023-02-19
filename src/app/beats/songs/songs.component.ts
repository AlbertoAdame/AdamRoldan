import { Component, OnInit } from '@angular/core';
import { BeatInterface } from '../../interfaces/beat-response.interface';
import { BeatService } from '../../services/beat.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  results : BeatInterface[] = []

  constructor(private beatService:BeatService) { }

  ngOnInit(): void {
    this.beatService.searchBeats()
    .subscribe({
      next: (resp) => this.results = resp
      //falta error
    })
  }
}
