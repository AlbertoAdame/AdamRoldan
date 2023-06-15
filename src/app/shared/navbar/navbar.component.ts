import { Component, EventEmitter, OnInit, Output, Input, ElementRef, HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BeatService } from '../../services/beat.service';
import { TokenInterface } from '../../interfaces/token.interface';
import { log } from 'console';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Content } from 'src/app/interfaces/pageable.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() enviarHijo: EventEmitter<boolean> = new EventEmitter();

  search: boolean = false;
  cart: boolean = false;
  animation: boolean = true;
  color: string = 'white';
  username: string = "";
  query: string = "";

  sideBar: boolean = false;

  currentUrl = this.router.url;

  isLoggedIn!: boolean;
  role: string = '';

  currentCartItems: Content[] = [];
  totalPrice: string = "0.00";


  constructor(private cookies: CookieService, private authService: AuthService, private router: Router, private beatService: BeatService,
    private translate: TranslateService, private language: LanguageService, private shoppingCartService: ShoppingCartService, private elementRef: ElementRef) {
    this.translate.addLangs(['es', 'en']);
  }


  ngOnInit(): void {



    this.currentCartItems = this.shoppingCartService.beats;

    this.totalPrice = this.shoppingCartService.getTotalPrice();

    this.shoppingCartService.totalPrice$.subscribe((totalPrice) => {

      if (parseInt(totalPrice, 10) > parseInt(this.totalPrice, 10))
        this.cart = !this.cart;
      this.totalPrice = totalPrice;
      this.currentCartItems = this.shoppingCartService.beats;
    });

    this.language.currentLanguageSubject.subscribe((lang: any) => {
      this.translate.use(lang);
    });

    this.translate.use(this.language.currentLanguage);

    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
        setTimeout(() => {
          this.role = this.cookies.get('role');
        }, 0.01);
      }

    })

    if (this.cookies.get('sub')) {
      this.username = this.cookies.get('sub')
    }
    else {
      this.username = ''
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    const navbar = this.elementRef.nativeElement.querySelector('nav');
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;

    navbar.classList.toggle('scroll', scrolled == 0);
  }

  //Hemos desactivado la barra de búsqueda para esta parte del proyecto
  // showSearchBar(): void {
  //   this.search = !this.search;

  //   if (this.color === 'white')
  //     this.color = 'black';
  //   else
  //     this.color = 'white';
  // }

  showCart(): void {
    this.animation = true
    this.cart = !this.cart
  }

  //Este método lo usaremos para que no se cierre la ventana emergente al hacer click encima
  notChangeCart() {
    setTimeout(() => {
      this.animation = false
      this.cart = true;
    }, 0.01);
  }

  //Este método cierra la ventana emergente al hacer click 
  closeCart() {
    setTimeout(() => {
      this.cart = false;
    }, 5);
  }

  //Borraremos un producto del carrito
  deleteProduct(item: Content) {
    setTimeout(() => {
      this.shoppingCartService.eliminarDelCarrito(item);
      this.cart = true;
    }, 0.1);
  }

  showSideBar(): void {
    this.sideBar = !this.sideBar
    this.enviarHijo.emit(this.sideBar);
  }


  //Cerraremos sesión
  logout(): void {
    this.authService.logout()
    this.isLoggedIn = false;
    this.shoppingCartService.clearCart();
  }

  //Obtendremos la búsqueda del usuario
  getSearch() {
    this.beatService.searchBeatsPageable(0, 200, "title", this.query)
    this.query = ""
  }

}
