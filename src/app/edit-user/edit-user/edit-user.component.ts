import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {

  isLoggedIn!: boolean;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]],

  })

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
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
    console.log(this.myForm.value)

  }


}

