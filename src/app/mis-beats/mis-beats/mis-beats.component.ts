import { Component, OnInit } from '@angular/core';
import { PurchasesService } from '../../services/purchases.service';
import { CookieService } from 'ngx-cookie-service';
import { Purchase } from 'src/app/interfaces/purchase.interface';
import { SpinnerService } from '../../services/spinner.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'app-mis-beats',
  templateUrl: './mis-beats.component.html',
  styleUrls: ['./mis-beats.component.css']
})
export class MisBeatsComponent implements OnInit {

  username: string = '';
  results: Purchase[] = []
  purchases: any = {}

  constructor(private purchasesService: PurchasesService, private cookies: CookieService, private spinnerService: SpinnerService,
    private storage: AngularFireStorage, private translate: TranslateService, private language: LanguageService) {

  }

  ngOnInit(): void {

    if (this.language.currentLanguage == undefined)
      this.translate.use('en');
    else {
      this.translate.use(this.language.currentLanguage);
    }

    setTimeout(() => {
      this.activeSpinner(true);
    }, 0.01);
    this.username = this.cookies.get('sub')
    this.purchasesService.getPurchasesByName(this.username)
      .subscribe({
        next: (resp) => {

          this.results = resp
          this.ordenar()
          this.activeSpinner(false);
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

  /**
 * Para activar o desactivar el spinner
 * @param value 
 */
  activeSpinner(value: boolean) {
    this.spinnerService.spinnerSubject.next(value);
  }

  /**
   * Te reenviará a la web para escuchar y descargar el beat comprado
   * @param url 
   */
  download(url: string) {
    this.activeSpinner(true)
    const storageRef = this.storage.refFromURL(url);

    storageRef.getDownloadURL().subscribe((downloadURL) => {
      this.activeSpinner(false)
      window.open(downloadURL);
    }, (error) => {
      this.activeSpinner(false)
      console.log(error);
    });
  }

  // download(url: string) {
  //   const storageRef = this.storage.refFromURL(url);

  //   storageRef.getDownloadURL().subscribe((downloadURL) => {
  //     fetch(downloadURL)
  //       .then(response => response.blob())
  //       .then(blob => {
  //         // Crea un enlace temporal para el archivo descargado
  //         const url = window.URL.createObjectURL(blob);
  //         // Crea un elemento <a> oculto para iniciar la descarga
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = 'nombre_archivo'; // Establece el nombre del archivo
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);
  //         // Revoca el objeto URL creado para liberar recursos
  //         window.URL.revokeObjectURL(url);
  //       });
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }
}