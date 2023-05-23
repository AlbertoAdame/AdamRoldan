import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BeatService } from '../../services/beat.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-beats',
  templateUrl: './beats.component.html',
  styleUrls: ['./beats.component.css',]
})
export class BeatsComponent implements OnInit {

  role: string = ''
  isLoggedIn!: boolean;
  query: string = ""

  constructor(
    private authService: AuthService,
    private cookies: CookieService) { }

  ngOnInit(): void {
    //Este método nos indica si el token es valido
    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }
    })

    this.role = this.cookies.get('role')

  }

  //Dejaremos esto aqui para el proyecto final

  // console() {
  //   this.beatService.searchBeatsPageable(0, 200, "date", this.query)
  //   this.query = ""
  // }

}
