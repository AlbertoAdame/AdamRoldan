import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('logInForm') logInForm!: NgForm;
  @ViewChild('registerForm') registerForm!: NgForm;

  currentUrl = this.router.url;

  // ************************** CHANGE VIEW ***************************

  view: boolean = false;

  // ************************** VALIDATIONS ***************************

  validLoginUsername: boolean = false;
  validPassword: boolean = false;

  touchedEmail: boolean = false;
  touchedPassword: boolean = false;

  validNewEmail: boolean = false;
  validNewPassword: boolean = false;
  validRepeatNewPassword: boolean = false;
  validUsername: boolean = false;
  validName: boolean = false;

  touchedNewEmail: boolean = false;
  touchedNewPassword: boolean = false;
  touchedRepeatNewPassword: boolean = false;
  touchedUsername: boolean = false;
  touchedName: boolean = false;
  touchedCaptcha: boolean = false;

  // ************************** LOGIN ***************************

  username: string = ""
  password: string = "";


  // ************************** REGISTER ***************************

  newEmail: string = ""
  newPassword: string = "";
  repeatNewPassword: string = "";
  newName: string = "";
  newUsername: string = "";

  captcha: string = '';

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private cookies: CookieService) { }

  // ************************** Si entramos en el login borramos las cookies ***************************

  ngOnInit(): void {
    this.cookies.deleteAll()
  }

  // ************************** LOGIN **************************

  //Aquí haremos el login
  login() {
    if (this.logInForm.invalid) {
      this.logInForm.control.markAllAsTouched();
      return;
    }

    //Llamaremos al servicio para loguearnos
    if (!this.validLoginUsername && !this.validPassword && this.touchedEmail && this.touchedPassword) {
      this.authService.login(this.username, this.password)
        .subscribe({
          next: (resp) => {
            if (resp) {
              this.router.navigate(['/']);
            }
            else {
              this.username = '';
              this.password = '';
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mail or password incorrect',
                confirmButtonColor: '#9e1815',

              })
            }
          },
          error: error => console.log(error)
        })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        confirmButtonColor: '#9e1815',
      })

    }
  }

  // ************************** REGISTER ***************************

  //Aquí haremos el register
  newAccount(): void {
    if (this.registerForm.invalid) {
      this.registerForm.control.markAllAsTouched();
      return;
    }
    //Llamaremos al servicio para registrarnos
    if (!this.validNewEmail && !this.validNewPassword && !this.validRepeatNewPassword && !this.validUsername && !this.validName && this.touchedNewEmail && this.touchedNewPassword && this.touchedRepeatNewPassword && this.touchedUsername && this.touchedName && this.captcha != "") {
      this.userService.newUser(this.newUsername, this.newPassword, this.newName, this.newEmail)
        .subscribe({
          next: (resp) => {
            if (resp) {
              Swal.fire({
                icon: 'success',
                title: 'Congratulations!',
                text: 'Your account was created',
                confirmButtonColor: '#1b8d57'
              })
              //esto lo haremos para que se recargue y te muestre la ventana del login
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.currentUrl]);
              });

            }
          },
          error: (error) =>
            console.log(error)
        });

    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        confirmButtonColor: '#9e1815',

      })
    }
  }


  // ************************** CHANGE VIEW ***************************

  changeView(): void {
    this.view = !this.view
  }

  // ************************** LOG IN VALIDATIONS ***************************

  notValidUsernameLogin(campo: string): boolean {
    let result: boolean = false;

    if (this.logInForm?.controls[campo]?.touched) {
      this.touchedEmail = true;
      if (this.logInForm?.controls[campo]?.invalid) {
        result = true;
      }
      else {
        result = false;
      }
    }
    this.validLoginUsername = result;
    return result;
  }

  notValidPassword(campo: string): boolean {
    let result: boolean = false;
    if (this.logInForm?.controls[campo]?.touched) {
      this.touchedPassword = true;
      if (this.logInForm?.controls[campo]?.invalid)
        result = true
      else
        result = false
    }
    this.validPassword = result;
    return result
  }


  // ************************** REGISTER VALIDATIONS *********************+


  notValidNewEmail(campo: string): boolean {
    let result: boolean = false;

    if (this.registerForm?.controls[campo]?.touched) {
      this.touchedNewEmail = true;
      if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.registerForm?.controls[campo].value)) {
        result = false;
      }
      else {
        result = true;
      }
    }
    this.validNewEmail = result;
    return result;
  }

  notValidUsername(campo: string): boolean {
    let result: boolean = false;

    if (this.registerForm?.controls[campo]?.touched) {
      this.touchedUsername = true;
      if (this.registerForm?.controls[campo]?.invalid)
        result = true
      else
        result = false
    }
    this.validUsername = result;
    return result
  }

  notValidName(campo: string): boolean {
    let result: boolean = false;

    if (this.registerForm?.controls[campo]?.touched) {
      this.touchedName = true;
      if (this.registerForm?.controls[campo]?.invalid)
        result = true
      else
        result = false
    }
    this.validName = result;
    return result
  }

  notValidNewPassword(campo: string): boolean {
    let result: boolean = false;

    if (this.registerForm?.controls[campo]?.touched) {
      this.touchedNewPassword = true;
      if (this.registerForm?.controls[campo]?.invalid)
        result = true
      else
        result = false
    }
    this.validNewPassword = result;
    return result
  }

  notValidRepeatNewPassword(campo: string): boolean {
    let result: boolean = false;
    if (this.registerForm?.controls[campo]?.touched) {
      this.touchedRepeatNewPassword = true;
      if (this.newPassword != this.repeatNewPassword)
        result = true
      else
        result = false
    }
    this.validRepeatNewPassword = result;
    return result
  }

  // ************************** CAPTCHA *********************

  //Mensaje del captcha
  notValidCaptcha(campo: string): boolean {
    let result: boolean = false;
    if (this.registerForm?.controls[campo]?.touched) {
      this.touchedCaptcha = true;
      if (this.captcha == "")
        result = true
      else
        result = false
    }
    return result
  }

  //Función para el captcha
  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }


}
