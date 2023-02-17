import { Injectable } from '@angular/core';

import { Observable, switchMap, of, catchError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenInterface } from '../interfaces/token.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url:string='http://localhost:8086/signin';
  loggedIn:boolean = false;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private userService:UserService, private cookies:CookieService, private http:HttpClient) { }

  isAuthenticated() {    
    return this.http.get(this.url)
    .pipe( switchMap(token=> {
        return of(true)
    }), catchError (error=>{
      this.cookies.delete('token');
      return of(false)
    }))
  }

  login(email:string, password:string):Observable<boolean> {
    //Recuperamos el usuario y comprobamos que la contraseña sea correcta
    return this.http.post<TokenInterface>(this.url, {email,password}, this.httpOptions)
    .pipe( switchMap(token=> {
        this.cookies.set('token',  token.access_token);
        this.cookies.set('rol', token.rol)
        return of(true)
    }), catchError (error=>{
      this.cookies.delete('token');
      this.cookies.delete('rol');
      return of(false)
    }))

  }

  logout() {
    this.cookies.delete('token');
  }
}
