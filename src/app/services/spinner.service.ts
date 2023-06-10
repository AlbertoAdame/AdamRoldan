import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  spinnerSubject: Subject<any> = new Subject<any>();

  constructor() { }

}
