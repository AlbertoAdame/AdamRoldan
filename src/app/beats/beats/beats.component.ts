import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BeatService } from '../../services/beat.service';


@Component({
  selector: 'app-beats',
  templateUrl: './beats.component.html',
  styleUrls: ['./beats.component.css', ]
})
export class BeatsComponent implements OnInit {

  isLoggedIn!:boolean;
  query:string=""

  constructor(
    private authService:AuthService,
    private beatService: BeatService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe({
      next: (resp) =>{
        this.isLoggedIn=resp;
      }
    })
  }

console(){
  console.log(this.query)
  this.beatService.searchBeatsPageable(0, 200, "date", this.query)
}


}
