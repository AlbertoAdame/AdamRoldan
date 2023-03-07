import { Injectable } from '@angular/core';
import { Genre } from '../interfaces/genre.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private url = 'https://adamroldanapi-production.up.railway.app/genre';

  constructor(private http: HttpClient) { }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.url)
  }
}
