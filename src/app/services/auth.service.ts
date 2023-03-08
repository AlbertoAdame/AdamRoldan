import { Injectable } from '@angular/core';

import { Observable, switchMap, of, catchError, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenInterface } from '../interfaces/token.interface';
import { UserService } from './user.service';
import jwt_decode from "jwt-decode";
import { DecodeTokenInterface } from '../interfaces/decode-token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  url: string = 'https://adamroldanapi-production.up.railway.app/signin';
  urlJwt: string = 'https://adamroldanapi-production.up.railway.app/user' //Aqui en un princpio tenia una dirección jwt, pero al desplegarlo me ha dado fallos
  role: string = "";
  token!: DecodeTokenInterface;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private userService: UserService, private cookies: CookieService, private http: HttpClient) {

    this.http.get(this.urlJwt)
      .subscribe({
        next: () => this.loggedIn.next(true),
        error: () => this.loggedIn.next(false)

      })
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get(this.urlJwt)
      .pipe(switchMap(token => {
        console.log(true)
        return of(true)
      }), catchError(error => {
        this.cookies.delete('token');
        this.cookies.delete('sub');
        this.cookies.delete('role');

        console.log(false)
        return of(false)
      }))
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    //Recuperamos el usuario y comprobamos que la contraseña sea correcta
    return this.http.post<TokenInterface>(this.url, { email, password }, this.httpOptions)
      .pipe(switchMap(token => {
        this.loggedIn.next(true);
        this.cookies.set('token', token.token);
        this.token = jwt_decode(token.token)
        this.cookies.set('role', this.token.role)
        this.cookies.set('sub', this.token.sub)
        return of(true)
      }), catchError(error => {
        this.loggedIn.next(false);
        this.cookies.delete('token');
        this.cookies.delete('sub');
        this.cookies.delete('role');
        return of(false)
      }))

  }

  logout() {
    this.cookies.delete('token');
    this.cookies.delete('sub');
    this.cookies.delete('role');
    this.loggedIn.next(false);
    window.location.reload()

  }

}
