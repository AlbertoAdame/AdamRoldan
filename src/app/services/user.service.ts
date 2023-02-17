import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseInterface } from '../interfaces/user-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8086/user';

  constructor(private http : HttpClient) {

  }


  buscarBeats():Observable<UserResponseInterface[]>{
    return this.http.get<UserResponseInterface[]>(this.url)
      
  }
}
