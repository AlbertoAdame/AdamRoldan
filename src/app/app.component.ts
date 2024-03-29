import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComunicationService } from './services/comunication.service';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from './services/spinner.service';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'AdamRoldan';

  sideBar: boolean = false;

  reproductor: boolean = false;

  currentLanguage: boolean = true;

  spinner: boolean = false;
  role: string = '';

  constructor(private comunicationService: ComunicationService, private translate: TranslateService, private spinnerService: SpinnerService
    , private authService: AuthService, private cookies: CookieService) {
    this.translate.addLangs(['es', 'en']);
    let lang = localStorage.getItem('lang')

    if (lang == null) {
      localStorage.setItem('lang', 'en');
      this.translate.setDefaultLang('en');
    }
    else {
      this.translate.setDefaultLang(lang);
    }

    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        setTimeout(() => {
          this.role = this.cookies.get('role');
        }, 0.01);
      }

    })

  }

  ngOnInit() {
    this.comunicationService.currentBeatSubject.subscribe((beat: any) => {
      if (this.reproductor == false) {
        setTimeout(() => {
          this.comunicationService.currentBeatSubject.next(beat);
        }, 10);
      }

      if (beat != null) {
        this.reproductor = true;
      }
    });

    this.spinnerService.spinnerSubject.subscribe((value: any) => {
      this.spinner = value;
    });
  }

  guardar(sidebar: boolean) {
    this.sideBar = sidebar;
  }

  //Este método lo hemos creado para que cuando le demos a un botón y nos redireccione nos cierre el side bar
  esconder() {
    this.sideBar = !this.sideBar
  }

}
