import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  isLoggedIn!: boolean;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]],

  })

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private translate: TranslateService
    , private spinnerService: SpinnerService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit() {
    //Este método nos indica si el token es valido
    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }
    })
  }

  isValidField(field: string) {
    return this.myForm.controls[field].errors
      && this.myForm.controls[field].touched
  }

  save() {

    let success = '';
    let wrong = '';
    this.translate.get('Your message has been sent')
      .subscribe(arg => success = arg);
    this.translate.get('Something was wrong')
      .subscribe(arg => wrong = arg);

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return
    }
    this.activeSpinner(true);
    //Llamaremos al servicio para enviar un correo con la información introducida
    this.userService.contact(this.myForm.value.name, this.myForm.value.email, this.myForm.value.subject, this.myForm.value.message)
      .subscribe({
        next: (resp) => {
          this.activeSpinner(false);
          Swal.fire({
            icon: 'success',
            text: success
          }),
            this.myForm.reset()
        },
        error: (error) => {
          this.activeSpinner(false);
          Swal.fire({
            icon: 'error',
            text: wrong,
          })
          console.log(error)
        }
      });
  }

  /**
* Para activar o desactivar el spinner
* @param value 
*/
  activeSpinner(value: boolean) {
    this.spinnerService.spinnerSubject.next(value);
  }
}

