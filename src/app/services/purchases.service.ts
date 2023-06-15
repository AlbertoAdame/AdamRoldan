import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Purchase } from '../interfaces/purchase.interface';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  private url = environment.url + 'purchase';

  constructor(private http: HttpClient) { }

  getPurchasesByName(username: string): Observable<Purchase | any> {
    return this.http.get<Purchase>(`${this.url}/${username}`)
  }
}
