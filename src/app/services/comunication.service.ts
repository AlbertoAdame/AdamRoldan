import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {

  currentBeatSubject: Subject<any> = new Subject<any>();

  constructor() { }
}
