import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  search:boolean = false;
  cart:boolean = false;
  color:string = 'white';
  username:string = "";
  constructor(private cookies:CookieService) { }

  ngOnInit(): void {
    if(this.cookies.get('sub')){
      this.username = this.cookies.get('sub')
    }

  }

  showSearchBar():void{
    this.search = !this.search;
    if(this.color==='white')
      this.color= 'black';
    else
    this.color= 'white';
  }

  showCart():void{
    this.cart = !this.cart
  }

}
