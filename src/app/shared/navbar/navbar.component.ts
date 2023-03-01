import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BeatService } from '../../services/beat.service';

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
  query:string="";

  currentUrl = this.router.url;

  isLoggedIn!:boolean;
  

  constructor(private cookies:CookieService, private authService:AuthService, private router:Router, private beatService:BeatService) { }


  ngOnInit(): void {

    
    this.authService.isLoggedIn.subscribe({
      next: (resp) =>{
        this.isLoggedIn=resp;
      }
      
    })
    
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

  getSearch(){
    this.beatService.searchBeatsPageable(0, 200, "title", this.query)
    this.query=""
    // this.router.navigate(['beats']);
  }

}
