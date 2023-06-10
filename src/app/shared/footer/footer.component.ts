import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentLanguage!: string;

  constructor(private translate: TranslateService, private language: LanguageService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit(): void {

    if (this.language.currentLanguage == undefined) {
      this.translate.use('en');
      this.currentLanguage = 'en';
      this.language.setLanguage('en');
      this.language.currentLanguageSubject.next('en');
    }

    if (this.currentLanguage != this.language.currentLanguage) {
      this.currentLanguage = this.language.currentLanguage
      this.translate.use(this.language.currentLanguage)
    }

  }

  cambiarIdioma(idioma: string) {

    if (this.currentLanguage !== 'es' && idioma == 'es') {
      localStorage.setItem('lang', 'es');
      this.translate.use('es');
      this.currentLanguage = 'es';
      this.language.setLanguage('es');
      this.language.currentLanguageSubject.next('es');

    }
    else if (this.currentLanguage !== 'en' && idioma == 'en') {
      localStorage.setItem('lang', 'en');
      this.translate.use('en');
      this.currentLanguage = 'en';
      this.language.setLanguage('en');
      this.language.currentLanguageSubject.next('en');
    }

    this.scrollToTop()

  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}
