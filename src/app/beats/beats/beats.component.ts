import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-beats',
  templateUrl: './beats.component.html',
  styleUrls: ['./beats.component.css', ]
})
export class BeatsComponent implements OnInit {


  query:string=""

  constructor() { }

  ngOnInit(): void {
  }

console(){
  console.log(this.query)
  this.query=""
}


}
