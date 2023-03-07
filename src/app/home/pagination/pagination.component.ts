import { Component, OnInit } from '@angular/core';
import { BeatInterface } from 'src/app/interfaces/beat-response.interface';
import { Pageable } from 'src/app/interfaces/pageable.interface';
import { BeatService } from '../../services/beat.service';
import { Content } from '../../interfaces/pageable.interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  results: Content[] = []

  totalElements: number = 0;//cantidad total de items
  size: number = 0;
  numberOfElements: number = 5;//numero de beats por pagina
  actualPage: number = 0;



  constructor(private beatService: BeatService) { }

  ngOnInit(): void {
    this.getBeats();
  }

  getBeats() {
    this.beatService.searchBeats(this.actualPage, this.numberOfElements)
      .subscribe({
        next: (resp) => {
          console.log(resp.content[0].mood);

          this.results = resp.content
          this.totalElements = resp.totalElements
        }
        //falta error
      })
  }

  pageChangeEvent(event: number) {
    this.actualPage = event;
    this.getBeats();
  }

  changePageSize() {
    this.getBeats();
    console.log(this.numberOfElements)
  }

  secondsToString(seconds: number) {
    var minute: string | number = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second: string | number = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
  }

}
