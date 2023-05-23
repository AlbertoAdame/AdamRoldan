import { Injectable } from '@angular/core';
import { BeatInterface } from '../interfaces/beat-response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request } from '../interfaces/request.interface';
import { Purchase } from '../interfaces/purchase.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  _beats: BeatInterface[] = []

  constructor(private http: HttpClient) {

    this.loadCartFromSession();
  }

  get beats() {
    return this._beats;
  }

  addToCart(beat: BeatInterface) {
    let beatIndex = this._beats.findIndex(cartBeat => cartBeat.id_beat === beat.id_beat);
    if (beatIndex !== -1) {
      this._beats.push(beat);
    }
  }

  clearCart() {
    this._beats = [];
    this.saveCartToSession()
    return this._beats;
  }

  getTotalPrice() {
    let totalPrice: number = 0
    for (let beat of this._beats) {
      totalPrice += beat.price;
    }
    return totalPrice;
  }

  //Método para cargar el carrito en sesion.
  loadCartFromSession() {
    const carrito = sessionStorage.getItem('carrito');
    if (carrito) {
      this._beats = JSON.parse(carrito);
    }
  }

  //Método para poder guardar el carrito en la sesion.
  saveCartToSession() {
    sessionStorage.setItem('carrito', JSON.stringify(this._beats));
  }

  eliminarDelCarrito(beat: any) {
    let beatIndex = this._beats.findIndex(cartBeat => cartBeat.id_beat === beat.id_beat);

    if (beatIndex !== -1) {
      this._beats.splice(beatIndex, 1);
    }
  }

  //metodo para poder realizar la peticion de compra.
  addRequest(beat: BeatInterface, username: string) {
    // : Observable<any> esto lo tengo que añadir arriba, y tengo que hacer la prueba del console log, porque ahora de ahí tengo que sacar la id del request, y meterselo en el post
    let date = beat.date
    let totalPrice = beat.price;
    let idBeat = beat.id_beat

    let newRequest = this.http.post<any>(`${environment.url}/request`, { date, totalPrice, username })

    let response = JSON.stringify(newRequest)

    console.log(response);

    // return this.http.post<any>(`${environment.url}/purchase/${idBeat}?request=${response.idRequest}`, {});
  }

  //Obtiene todas las compras de un usuario en concreto.
  getPurchases(username: string): Observable<any> {
    return this.http.get<any>(`${environment.url}/buy/${username}`)
  }
}
