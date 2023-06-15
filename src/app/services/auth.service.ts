import { Injectable } from '@angular/core';

import { Observable, switchMap, of, catchError, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenInterface } from '../interfaces/token.interface';
import { UserService } from './user.service';
import jwt_decode from "jwt-decode";
import { DecodeTokenInterface } from '../interfaces/decode-token.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  url: string = environment.url + 'signin';
  urlJwt: string = environment.url + 'user' //Aqui en un princpio tenia una dirección jwt, pero al desplegarlo me ha dado fallos y lo he tenido que cambiar
  role: string = "";
  //Aquin guardaremos la info del token descodificado
  token!: DecodeTokenInterface;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private userService: UserService, private cookies: CookieService, private http: HttpClient) {

    //Pondremos en funcionamiento del BehavioSubject
    this.http.get(this.urlJwt)
      .subscribe({
        next: () => this.loggedIn.next(true),
        error: () => this.loggedIn.next(false)

      })
  }
  //AQui comprobaremos si el token es válido
  isAuthenticated(): Observable<boolean> {
    return this.http.get(this.urlJwt)
      .pipe(switchMap(token => {
        return of(true)
      }), catchError(error => {
        this.cookies.delete('token');
        this.cookies.delete('sub');
        this.cookies.delete('role');

        return of(false)
      }))
  }
  //El get para obtener el valor de isLoggedIn 
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  //Recuperamos el usuario y comprobamos que la contraseña sea correcta
  login(email: string, password: string): Observable<any> {
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
        return of(error)
      }))

  }

  //Borraremos las cookies y actualizaremos la página
  logout() {
    this.cookies.delete('token');
    this.cookies.delete('sub');
    this.cookies.delete('role');
    this.loggedIn.next(false);
    window.location.reload()

  }

}
