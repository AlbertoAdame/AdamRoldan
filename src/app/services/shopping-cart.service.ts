import { Injectable } from '@angular/core';
import { BeatInterface } from '../interfaces/beat-response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request } from '../interfaces/request.interface';
import { Purchase } from '../interfaces/purchase.interface';
import { Content } from '../interfaces/pageable.interface';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserResponseInterface } from '../interfaces/user-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  _beats: Content[] = []
  private totalPriceSubject: Subject<string> = new Subject<string>();
  totalPrice$: Observable<string> = this.totalPriceSubject.asObservable();

  constructor(private http: HttpClient) {

    this.loadCartFromSession();
  }

  get beats() {
    return this._beats;
  }

  loadCartFromSession() {
    const carrito = localStorage.getItem('carrito');
    if (carrito) {
      this._beats = JSON.parse(carrito);
    }
  }

  addToCart(beat: Content) {
    let totalPrice: string = "0.00"
    let beatIndex = this._beats.findIndex(cartBeat => cartBeat.idBeat === beat.idBeat);

    if (beatIndex == -1) {
      this._beats.push(beat);
      totalPrice = this.getTotalPrice()
      this.totalPriceSubject.next(totalPrice);
      this.saveCartToSession();
    }
  }

  eliminarDelCarrito(beat: any) {
    let totalPrice: string = "0.00"
    let beatIndex = this._beats.findIndex(cartBeat => cartBeat.idBeat === beat.idBeat);

    if (beatIndex !== -1) {
      this._beats.splice(beatIndex, 1);
      totalPrice = this.getTotalPrice()
      this.totalPriceSubject.next(totalPrice);
      this.saveCartToSession();
    }
  }

  saveCartToSession() {
    localStorage.setItem('carrito', JSON.stringify(this._beats));
  }

  clearCart() {
    this._beats = [];
    this.totalPriceSubject.next("0.00");
    localStorage.removeItem('carrito');
    return this._beats;
  }

  getTotalPrice() {
    let totalPrice: number = 0.00
    for (let beat of this._beats) {
      totalPrice += beat.price;
    }
    if (totalPrice == 0) {
      totalPrice = 0.00
    }

    this.totalPriceSubject.next(totalPrice.toFixed(2));
    return totalPrice.toFixed(2);
  }


  addPurchase(address: string): Observable<any> {
    let beatList: any;
    const carritoString = localStorage.getItem('carrito');

    if (carritoString !== null) {
      beatList = JSON.parse(carritoString);
    }

    return this.http.post<any>(`${environment.url}purchase?address=${address}`, beatList);
  }

  makePayment(stripeToken: any, totalPrice: any): Observable<any> {
    const url = "http://localhost:5000/checkout/"

    return this.http.post<any>(url, { token: stripeToken, price: totalPrice })
  }
}
