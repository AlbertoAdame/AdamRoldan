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


  searchUsers():Observable<UserResponseInterface[]>{
    return this.http.get<UserResponseInterface[]>(this.url)
      
  }

  newUser(email:string, password:string, name:string, username:string):Observable<UserResponseInterface[]>{
    return this.http.post<UserResponseInterface[]>(this.url, {username,password, email, name})//esto como se haría
  }
}
