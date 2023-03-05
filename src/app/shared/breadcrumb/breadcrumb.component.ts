import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  constructor(private router:Router) { }

  route:string[]=[]
  firstRoute:string|undefined=""
  separator:string = "/";

  ngOnInit(): void {
    this.route=this.router.url.slice(1).toUpperCase().split(this.separator)
    this.firstRoute = this.route.pop()    
  }


}
