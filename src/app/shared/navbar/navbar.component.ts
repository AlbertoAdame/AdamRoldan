import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  currentUrl = this.router.url;

  isLoggedIn!:boolean;
  

  constructor(private cookies:CookieService, private authService:AuthService, private router:Router) { }

  ngOnInit(): void {

    this.authService.isAuthenticated()
    .subscribe({
      next: (resp) =>{
        if (resp){
          this.isLoggedIn=true;
      }
      else{
        this.isLoggedIn=false;
      }
    }})

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

  logout():void{
    this.authService.logout()
    this.isLoggedIn=false;
  }

}
