import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeatInterface } from '../interfaces/beat-response.interface';
import { Observable, switchMap, of, catchError } from 'rxjs';
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
    //Este if lo tendremos que hacer para que la paginación funcione correctamente, ya que empieza por 0,
    //y al pulsar los botones la primera página es la 1, en vez de la 0
    if(pageNumber!=0){
      pageNumber-=1;
    }
    return this.http.get<Pageable>(`${this.url}?pageNumber=${pageNumber}&sizeNumber=${sizeNumber}&sortfield=date&stringfind=''`)
  }

  //Manera con get
  searchBeatsPageable(pageNumber:number, sizeNumber:number, sortField:string, stringFind:string){
    this.http.get<Pageable>(this.url + "?pageNumber=" + pageNumber+ "&sizeNumber=" + sizeNumber+ "&sortField=" + sortField+ "&stringFind=" + stringFind)
      .subscribe({
        next: resp => {
          this._beats = resp
          console.log(resp);
          
        },
        error: (error) => console.log(error)
        
      }
      )
  }

  uploadBeat(beat:any, picture:File):Observable<boolean>{
  
    console.log(picture);
    console.log(beat);
    
    

    const data:FormData = new FormData();
    // formData.append("file", new Blob([JSON.stringify({ picture })], {type: 'application/octet-stream'}))
    
    data.append('beat', new Blob([JSON.stringify( beat )], {type: "application/json" }));
    data.append('file', picture)

    return this.http.post<BeatInterface>(this.url, data)
    .pipe(switchMap(resp => {
      return of(true);
    }), catchError(error => {
      console.log(error);
      
      return of(false)
    }));
  }


}
