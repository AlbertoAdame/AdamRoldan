import { Injectable } from '@angular/core';
import { Genre } from '../interfaces/genre.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BeatGenre, sendBeatGenre } from '../interfaces/beat-genre.interface';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private url = environment.url + 'genre';
  private beatGenreUrl = environment.url + 'beatGenre/'

  constructor(private http: HttpClient) { }

  //Obtendremos la lista de generos
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.url)
  }

  //Añadiremos un genero a un beat en concreto
  addBeatGenre(idBeat: number, genre: string): Observable<BeatGenre> {
    let pruebaUrl: string = this.beatGenreUrl + idBeat + '?genre=' + genre;
    return this.http.post<BeatGenre>(pruebaUrl, {})
  }
  //Borraremos un genero a un beat en concreto
  deleteBeatGenre(idBeat: number, genre: string): Observable<BeatGenre> {
    let pruebaUrl: string = this.beatGenreUrl + idBeat + '?genre=' + genre;
    return this.http.delete<BeatGenre>(pruebaUrl)
  }
}
