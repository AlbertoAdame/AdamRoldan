import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserResponseInterface } from '../interfaces/user-response.interface';
import { CookieService } from 'ngx-cookie-service';
import { TokenInterface } from '../interfaces/token.interface';
import { Contact } from '../interfaces/contact.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private url = environment.url + 'user';

  private urlContact = environment.url + 'contactUs';

  constructor(private http: HttpClient, private cookies: CookieService) {

  }

  //Obtendremos la lista de usuario
  searchUsers(): Observable<UserResponseInterface[]> {
    return this.http.get<UserResponseInterface[]>(this.url)

  }
  //Buscaremos un usuario por una id
  searchUser(id: string): Observable<UserResponseInterface> {
    return this.http.get<UserResponseInterface>(`${this.url}/${id}`)
  }

  //Crearemos un usuario
  newUser(username: string, password: string, name: string, email: string): Observable<UserResponseInterface> {
    return this.http.post<UserResponseInterface>(this.url, { username, password, name, email })
  }

  //Envairemos el correo electrónico
  contact(name: string, email: string, subject: string, message: string): Observable<Contact> {
    return this.http.post<Contact>(this.urlContact, { name, email, subject, message })
  }

  //Editarmos un user
  editUser(name: string, email: string, password: string): Observable<UserResponseInterface> {
    return this.http.put<UserResponseInterface>(`${this.url}/${this.cookies.get('sub')}`, { name, email, password })
  }
}
