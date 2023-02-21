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

  constructor(private http : HttpClient) {

  }

  searchBeats():Observable<Pageable>{
    return this.http.get<Pageable>(this.url + "?pageNumber=0&sizeNumber=200")
  }

  searchBeatsPageable(pageNumber:number, sizeNumber:number, sortField:string, stringFind:string):Observable<Pageable>{
    return this.http.get<Pageable>(this.url + "?pageNumber=" + pageNumber+ "&sizeNumber=" + sizeNumber+ "&sortField=" + sortField+ "&stringFind=" + stringFind)
  }



}
