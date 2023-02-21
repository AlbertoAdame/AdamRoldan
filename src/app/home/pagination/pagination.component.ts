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

  results : Content[] = []

  totalElements:    number = 0;//cantidad total de items
  size:             number = 0;   
  numberOfElements: number = 5;//numero de beats por pagina
  actualPage : number = 0;

  sortField:string ="date";
  stringFind:string="";



  constructor(private beatService:BeatService) { }

  ngOnInit(): void {
    this.getBeats();
  }

  getBeats(){
    this.beatService.searchBeatsPageable(this.actualPage, this.numberOfElements, this.sortField, this.stringFind)
    .subscribe({
      next: (resp) => {
        this.results = resp.content
        this.totalElements=resp.totalElements
      }
      //falta error
    })
  }

  pageChangeEvent(event: number){
    this.actualPage = event;
    this.getBeats();
}

  changePageSize(){
    this.getBeats();
    console.log(this.numberOfElements)
  }

}
