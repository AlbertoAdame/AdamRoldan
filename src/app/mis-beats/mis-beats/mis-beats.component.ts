import { Component, OnInit } from '@angular/core';
import { PurchasesService } from '../../services/purchases.service';
import { CookieService } from 'ngx-cookie-service';
import { Purchase } from 'src/app/interfaces/purchase.interface';

@Component({
  selector: 'app-mis-beats',
  templateUrl: './mis-beats.component.html',
  styleUrls: ['./mis-beats.component.css']
})
export class MisBeatsComponent implements OnInit {

  username: string = '';
  results: Purchase[] = []
  purchases: any = {}
  constructor(private purchasesService: PurchasesService, private cookies: CookieService) {

  }

  ngOnInit(): void {
    this.username = this.cookies.get('sub')
    this.purchasesService.getPurchasesByName(this.username)
      .subscribe({
        next: (resp) => {

          this.results = resp
          this.ordenar()
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  ordenar() {
    this.results.forEach(response => {
      let idRequest: number | undefined;
      let Request = response.idRequest;

      if (typeof Request === 'object') {
        idRequest = Request.idRequest;
      }
      else
        idRequest = Request
      if (idRequest !== undefined) {
        if (!this.purchases[idRequest]) {
          this.purchases[idRequest] = response.idRequest;
          this.purchases[idRequest].idBeats = [];
        }

        if (response.idBeat) {
          this.purchases[idRequest].idBeats.push(response.idBeat);
        }
      }
    });
  }

  getPurchaseKeys(): string[] {
    return Object.keys(this.purchases);
  }



}
