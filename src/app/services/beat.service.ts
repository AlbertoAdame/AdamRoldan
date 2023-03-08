import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeatInterface } from '../interfaces/beat-response.interface';
import { Observable, switchMap, of, catchError } from 'rxjs';
import { Pageable, MoodClass } from '../interfaces/pageable.interface';
import { Mood, MoodNew } from '../interfaces/mood.interface';
import { Genre } from '../interfaces/genre.interface';

@Injectable({
  providedIn: 'root'
})
export class BeatService {
  private url = 'https://adamroldanapi-production.up.railway.app/beat';

  moodClass!:MoodNew

  _beats!: Pageable;
  constructor(private http: HttpClient) {

  }

  get beats(): Pageable {
    return this._beats;
  }

  //Manera simple
  searchBeats(pageNumber: number, sizeNumber: number): Observable<Pageable> {
    //Este if lo tendremos que hacer para que la paginación funcione correctamente, ya que empieza por 0,
    //y al pulsar los botones la primera página es la 1, en vez de la 0
    if (pageNumber != 0) {
      pageNumber -= 1;
    }
    return this.http.get<Pageable>(`${this.url}?pageNumber=${pageNumber}&sizeNumber=${sizeNumber}&sortfield=date&stringfind=''`)
  }

  //Manera con get
  searchBeatsPageable(pageNumber: number, sizeNumber: number, sortField: string, stringFind: string) {
    this.http.get<Pageable>(this.url + "?pageNumber=" + pageNumber + "&sizeNumber=" + sizeNumber + "&sortField=" + sortField + "&stringFind=" + stringFind)
      .subscribe({
        next: resp => {
          this._beats = resp

        },
        error: (error) => console.log(error)

      }
      )
  }

  getBeat(id: string): Observable<BeatInterface> {
    return this.http.get<BeatInterface>(`${this.url}/${id}`)
  }

  uploadBeat(beat: any, picture: File, genre: Genre, mood: Mood): Observable<boolean> {

    const data: FormData = new FormData();

    data.append('beat', new Blob([JSON.stringify(beat)], { type: "application/json" }));
    data.append('file', picture)
    data.append('genre', new Blob([JSON.stringify(genre)], { type: "application/json" }));
    data.append('mood', new Blob([JSON.stringify(mood)], { type: "application/json" }));


    return this.http.post<BeatInterface>(this.url, data)
      .pipe(switchMap(resp => {
        return of(true);
      }), catchError(error => {
        console.log(error);

        return of(false)
      }));
  }


  editBeat(id:string, title:string, price:number, bpm:number, time:number, moodStr:string ): Observable<boolean> {
    console.log(id);

    
    const mood = { "mood": moodStr }
    console.log(mood);
    
    

    return this.http.put<any>(`${this.url}/${id}`, {title, price, bpm, time, mood})
      .pipe(switchMap(resp => {
        return of(true);
      }), catchError(error => {
        console.log(error);

        return of(false)
      }));
  }

  deleteBeat(id: number): Observable<BeatInterface[]> {
    return this.http.delete<BeatInterface[]>(`${this.url}/${id}`)
  }




  // editBeat(title:string,price:number,bpm:number, time:number, mood:string ): Observable<boolean> {  

  //   return this.http.put<BeatInterface>(this.url,   {
  //     title: title,
  //     price: price,
  //     bpm: bpm,
  //     time: time,
  //     mood:{
  //       mood:mood
  //     }
  //   })
  //     .pipe(switchMap(resp => {
  //       return of(true);
  //     }), catchError(error => {
  //       console.log(error);

  //       return of(false)
  //     }));
  // }


}
