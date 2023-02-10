import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  search:boolean = false;
  cart:boolean = false;
  constructor() { }

  ngOnInit(): void {
    // const search = document.querySelector('.search')
    // const btn = document.querySelector('.btn')
    // const input: = document.querySelector('.input')

    // btn?.addEventListener('click', () => {
    // search?.classList.toggle('active')
    // input?.focus()
// })
  }

  showSearchBar():void{
    this.search = !this.search
  }

  showCart():void{
    this.cart = !this.cart
  }

}
