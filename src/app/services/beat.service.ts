import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeatInterface } from '../interfaces/beat-response.interface';
import { Observable, switchMap, of, catchError, Subject } from 'rxjs';
import { Pageable, MoodClass } from '../interfaces/pageable.interface';
import { Mood, MoodNew } from '../interfaces/mood.interface';
import { Genre } from '../interfaces/genre.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeatService {
  private url = environment.url + 'beat';

  moodClass!: MoodNew

  _beats!: Pageable;

  currentBeatSubject: Subject<any> = new Subject<any>();

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

  //Recogeremos lo beats
  getBeat(id: string): Observable<BeatInterface> {
    return this.http.get<BeatInterface>(`${this.url}/${id}`)
  }

  //Subiremos un beat
  uploadBeat(beat: any, picture: File, genre: Genre, mood: Mood): Observable<boolean> {
    //Introduciremos todos los datos en un FormData para enviarlos
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

  //Editaremos un beat
  editBeat(id: string, title: string, price: number, bpm: number, time: number, moodStr: string): Observable<boolean> {

    //Esto es necesario para que reconozca el mood correctamente en el backend
    const mood = { "mood": moodStr }

    return this.http.put<any>(`${this.url}/${id}`, { title, price, bpm, time, mood })
      .pipe(switchMap(resp => {
        return of(true);
      }), catchError(error => {
        console.log(error);

        return of(false)
      }));
  }

  //Borraremos un beat
  deleteBeat(id: number): Observable<BeatInterface[]> {
    return this.http.delete<BeatInterface[]>(`${this.url}/${id}`)
  }


  // setCurrentBeat(beat: any): void {
  //   const song = {beat}
  //   this.currentBeatSubject.next(song);
  // }

  // getCurrentBeat(): any {
  //   return this.currentBeat
  // }

  // getCurrentBeatObservable(): Observable<any> {
  //   return this.currentBeatSubject.asObservable();
  // }

}
