import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { UserResponseInterface } from '../../interfaces/user-response.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {

  isLoggedIn!: boolean;

  user?: UserResponseInterface;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['']

  })

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private cookies: CookieService) { }

  ngOnInit() {
    //Este método nos indica si el token es valido
    this.authService.isLoggedIn.subscribe({
      next: (resp) => {
        this.isLoggedIn = resp;
      }
    })

    let id = this.cookies.get('sub')
    //Buscaremos el usuario que queramos editar
    this.userService.searchUser(id)
      .subscribe({
        next: (resp) => {

          if (resp) {
            this.user = resp;

            this.myForm.reset({
              name: resp.name,
              email: resp.email,
              password: ''
            })

          }

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
    //Llamaremos al servicio para editar el user
    this.userService.editUser(this.myForm.value.name, this.myForm.value.email, this.myForm.value.password)
      .subscribe({
        next: (resp) => {
          Swal.fire({
            icon: 'success',
            title: 'Perfect',
            text: 'Your account was updated'
          })
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

