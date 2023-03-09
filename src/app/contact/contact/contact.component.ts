import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router) { }

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

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return
    }
    //Llamaremos al servicio para enviar un correo con la información introducida
    this.userService.contact(this.myForm.value.name, this.myForm.value.email, this.myForm.value.subject, this.myForm.value.message)
      .subscribe({
        next: (resp) => {
          Swal.fire({
            icon: 'success',
            title: 'Your message was sent',
            text: 'You will receive an answer soon'
          }),
            this.myForm.reset()
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',

          })
          console.log(error)
        }
      });
  }
}

