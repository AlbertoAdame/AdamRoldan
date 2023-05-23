import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  _currentLanguage!: string

  currentLanguageSubject: Subject<any> = new Subject<any>();

  constructor() { }

  get currentLanguage(): string {
    return this._currentLanguage;
  }

  setLanguage(lang: string): void {
    this._currentLanguage = lang;
  }

}
