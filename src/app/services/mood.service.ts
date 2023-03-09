import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mood } from '../interfaces/mood.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private url = environment.url + 'mood';

  constructor(private http: HttpClient) { }

  //Obtendremos la lista de moods
  getMoods(): Observable<Mood[]> {
    return this.http.get<Mood[]>(this.url)
  }
}
