import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BeatService } from '../../services/beat.service';
import { TokenInterface } from '../../interfaces/token.interface';
import { log } from 'console';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() enviarHijo: EventEmitter<boolean> = new EventEmitter();

  search: boolean = false;
  cart: boolean = false;
  color: string = 'white';
  username: string = "";
  query: string = "";

  sideBar: boolean = false;

  currentUrl = this.router.url;

  isLoggedIn!: boolean;
  role: boolean = false


  constructor(private cookies: CookieService, private authService: AuthService, private router: Router, private beatService: BeatService) { }


  ngOnInit(): void {

    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }

    })

    if (this.cookies.get('sub')) {
      this.username = this.cookies.get('sub')
    }
    else {
      this.username = ''
    }
  }

  //Hemos desactivado la barra de búsqueda para esta parte del proyecto
  showSearchBar(): void {
    this.search = !this.search;

    if (this.color === 'white')
      this.color = 'black';
    else
      this.color = 'white';
  }

  //Al pulsar mostraremos el carrito, aunque lo tendremos desactivado para esta partde del proyecto
  showCart(): void {
    this.cart = !this.cart
  }

  showSideBar(): void {
    this.sideBar = !this.sideBar
    this.enviarHijo.emit(this.sideBar);
  }


  //Cerraremos sesión
  logout(): void {
    this.authService.logout()
    this.isLoggedIn = false;
  }

  //Obtendremos la búsqueda del usuario
  getSearch() {
    this.beatService.searchBeatsPageable(0, 200, "title", this.query)
    this.query = ""
  }

}
