import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeatInterface } from '../interfaces/beat-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeatService {
  private url = 'http://localhost:8086/beat';

  constructor(private http : HttpClient) {

  }


  buscarBeats():Observable<BeatInterface[]>{
    return this.http.get<BeatInterface[]>(this.url)
      
  }

}
