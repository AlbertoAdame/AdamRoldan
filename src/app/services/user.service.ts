import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserResponseInterface } from '../interfaces/user-response.interface';
import { CookieService } from 'ngx-cookie-service';
import { TokenInterface } from '../interfaces/token.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private url = 'http://localhost:8086/user';
  
  // private cookiesToken = this.cookies.get('token');
  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : this.cookiesToken})
  // }


  constructor(private http : HttpClient) {

  }


  searchUsers():Observable<UserResponseInterface[]>{
    return this.http.get<UserResponseInterface[]>(this.url)
      
  }

  newUser(username:string, password:string, name:string , email:string):Observable<UserResponseInterface[]>{
    return this.http.post<UserResponseInterface[]>(this.url, {username, password,name, email})
  }
}
