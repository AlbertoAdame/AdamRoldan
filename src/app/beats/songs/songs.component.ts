import { Component, Input, OnInit } from '@angular/core';

import { BeatService } from '../../services/beat.service';
import { Content, Pageable } from '../../interfaces/pageable.interface';
import { Page } from 'ngx-pagination';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  results : Content[]=[];
  flag : boolean = false;
  // @Input() query:string="";
  

  constructor(private beatService:BeatService) { 
  }

  ngOnInit(): void {
    // this.beatService.searchBeatsPageable(0, 200, "date", this.query)
    // .subscribe({
    //   next: (resp) => {
    //     this.results = resp.content
    //   }
    //   //falta error
    // })
    // if(this.beatService.beats == undefined){
      this.beatService.searchBeatsPageable(0, 200, "date", '')
    // }
    //   .subscribe({
    //     next: resp => this.beats = resp
    //   }
    //   )

  }

  get beats(): Pageable{
    console.log(this.beatService.beats); 
    
    return this.beatService.beats
  }

  secondsToString(seconds:number) {
    var minute:string|number = Math.floor((seconds / 60) % 60);
    minute = (minute < 10)? '0' + minute : minute;
    var second:string|number = seconds % 60;
    second = (second < 10)? '0' + second : second;
    return minute + ':' + second;
  }
}
