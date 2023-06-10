import { Injectable } from '@angular/core';
import { Genre } from '../interfaces/genre.interface';
import { Observable, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BeatGenre, sendBeatGenre } from '../interfaces/beat-genre.interface';
import { BeatService } from './beat.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private url = environment.url + 'genre';
  private beatGenreUrl = environment.url + 'beatGenre/'

  constructor(private http: HttpClient, private beatService: BeatService) { }

  //Obtendremos la lista de generos
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.url)
  }

  //Obtendremos la lista de generos que no estén ya asignados al beat
  getGenresNoAdded(id: number): Observable<Genre[]> {
    return this.beatService.getBeat(id.toString()).pipe(
      switchMap((resp) => {
        let selectedGenres: any[] = resp.genreList;
        return this.getGenres().pipe(
          map((allGenres) => {
            const usedGenres = selectedGenres.map((item) => item.genre);
            return allGenres.filter((genre) => !usedGenres.some((selected) => selected.genre === genre.genre));
          })
        );
      })
    );
  }

  //Añadiremos un genero a un beat en concreto
  addBeatGenre(idBeat: number, genre: string): Observable<BeatGenre> {
    genre = encodeURIComponent(genre);
    let pruebaUrl: string = this.beatGenreUrl + idBeat + '?genre=' + genre;
    return this.http.post<BeatGenre>(pruebaUrl, {})
  }
  //Borraremos un genero a un beat en concreto
  deleteBeatGenre(idBeat: number, genre: string): Observable<BeatGenre> {
    if (genre == 'R&B')
      genre = encodeURIComponent(genre);
    let pruebaUrl: string = this.beatGenreUrl + idBeat + '?genre=' + genre;
    return this.http.delete<BeatGenre>(pruebaUrl)
  }
}
