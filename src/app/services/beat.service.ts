import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeatInterface } from '../interfaces/beat-response.interface';
import { Observable, BehaviorSubject } from 'rxjs';
import { Pageable } from '../interfaces/pageable.interface';

@Injectable({
  providedIn: 'root'
})
export class BeatService {
  private url = 'http://localhost:8086/beat';

  _beats!: Pageable; 
  constructor(private http : HttpClient) {

  }

  get beats(): Pageable{
    return this._beats;
  } 

  //Manera simple
  searchBeats(pageNumber:number, sizeNumber:number):Observable<Pageable>{
    return this.http.get<Pageable>(`${this.url}?pageNumber=${pageNumber}&sizeNumber=${sizeNumber}&sortfield=date&stringfind=''`)
  }

  //Manera con get
  searchBeatsPageable(pageNumber:number, sizeNumber:number, sortField:string, stringFind:string){
    this.http.get<Pageable>(this.url + "?pageNumber=" + pageNumber+ "&sizeNumber=" + sizeNumber+ "&sortField=" + sortField+ "&stringFind=" + stringFind)
      .subscribe({
        next: resp => this._beats = resp
      }
      )
  }



}
