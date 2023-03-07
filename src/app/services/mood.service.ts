import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mood } from '../interfaces/mood.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private url = 'https://adamroldanapi-production.up.railway.app/mood';

  constructor(private http: HttpClient) { }

  getMoods(): Observable<Mood[]> {
    return this.http.get<Mood[]>(this.url)
  }
}
