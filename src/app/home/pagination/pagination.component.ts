import { Component, OnInit } from '@angular/core';
import { BeatInterface } from 'src/app/interfaces/beat-response.interface';
import { Pageable } from 'src/app/interfaces/pageable.interface';
import { BeatService } from '../../services/beat.service';
import { Content } from '../../interfaces/pageable.interface';
import { ComunicationService } from 'src/app/services/comunication.service';

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



  constructor(private beatService: BeatService, private comunicationService: ComunicationService) { }

  ngOnInit(): void {
    //Cogeremos los beats del servicio al iniciar
    this.getBeats();
  }
  //Cogeremos los beats del servicio 
  getBeats() {
    this.beatService.searchBeats(this.actualPage, this.numberOfElements)
      .subscribe({
        next: (resp) => {

          this.results = resp.content
          this.totalElements = resp.totalElements
        }

      })
  }

  //Para mostrar mas o menos valores
  pageChangeEvent(event: number) {
    this.actualPage = event;
    this.getBeats();
  }

  //Para mostrar mas o menos valores
  changePageSize() {
    this.getBeats();
  }

  //Este método pasará los segundos a minutos en este formato '00:00'
  secondsToString(seconds: number) {
    var minute: string | number = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second: string | number = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
  }

  audioPlayer(beat: any) {

    this.comunicationService.currentBeatSubject.next(beat);

  }

}
