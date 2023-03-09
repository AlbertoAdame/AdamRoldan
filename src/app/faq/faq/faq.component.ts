import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  license: boolean = false;
  noLicense: boolean = true;

  youtube: boolean = false;
  noYoutube: boolean = true;

  leasing: boolean = false;
  noLeasing: boolean = true;

  payment: boolean = false;
  noPayment: boolean = true;

  order: boolean = false;
  noOrder: boolean = true;

  color: string = 'white';

  isLoggedIn!: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }
    })
  }
  //Todos los métodos hacen lo mismo y es mostrar la información cuando le demos un click
  showLicense(): void {
    this.license = !this.license
    this.noLicense = !this.noLicense
    if (this.color == 'white')
      this.color = 'red'
    else
      this.color = 'white'

  }

  showYoutube(): void {
    this.youtube = !this.youtube
    this.noYoutube = !this.noYoutube
    if (this.color == 'white')
      this.color = 'red'
    else
      this.color = 'white'
  }

  showLeasing(): void {
    this.leasing = !this.leasing
    this.noLeasing = !this.noLeasing
    if (this.color == 'white')
      this.color = 'red'
    else
      this.color = 'white'
  }

  showPaiment(): void {
    this.payment = !this.payment
    this.noPayment = !this.noPayment
    if (this.color == 'white')
      this.color = 'red'
    else
      this.color = 'white'
  }

  showOrder(): void {
    this.order = !this.order
    this.noOrder = !this.noOrder
    if (this.color == 'white')
      this.color = 'red'
    else
      this.color = 'white'
  }

}
