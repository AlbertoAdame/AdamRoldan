import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { BeatService } from '../../services/beat.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  isLoggedIn!:boolean;

  myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: ['', [Validators.required]],
    bpm: ['', [Validators.required]],
    picture: [''],
    time: ['', [Validators.required]],
  })
  
  constructor(private fb: FormBuilder, private authService:AuthService, private beatService:BeatService, private router:Router) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe({
      next: (resp) =>{
        this.isLoggedIn=resp;
      }
    })
  }

  isValidField(field: string){
    return this.myForm.controls[field].errors
    && this.myForm.controls[field].touched
  }

  save(){
    console.log(this.myForm.value.title, this.myForm.value.price, this.myForm.value.bpm, this.myForm.value.picture, this.myForm.value.time)
    console.log(this.myForm)
    
    if (this.myForm.invalid){

      this.myForm.markAllAsTouched()
      return
  }
    this.beatService.uploadBeat(this.myForm.value.title, this.myForm.value.price, this.myForm.value.bpm, this.myForm.value.picture, this.myForm.value.time)
    .subscribe({
      next: (resp) => {
        if(resp){
          Swal.fire({
            icon: 'success',
            title: 'Your message was sent',
            text: 'You will receive an answer soon'
          }),
          this.myForm.reset()
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al subir su archivo',
    
          })
        }
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

