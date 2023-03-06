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

  json :any = {
    title: '',
    price: null,
    bpm: null,
    time:null
  }

  isLoggedIn!:boolean;

  myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: ['', [Validators.required]],
    bpm: ['', [Validators.required]],
    time: ['', [Validators.required]],
    picture:['',[Validators.required]],
    fileSource:['', [Validators.required]]
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

  onFileChange(event:any) {
    
    
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  
  save(){
    console.log(this.myForm)
    
    if (this.myForm.invalid){
      
      this.myForm.markAllAsTouched()
      return
    }
    
    this.json.title = this.myForm.value.title
    this.json.price = this.myForm.value.price
    this.json.bpm = this.myForm.value.bpm
    this.json.time = this.myForm.value.time
    
    console.log(this.myForm.get('fileSource')?.value)
    
    this.beatService.uploadBeat(this.json, this.myForm.get('fileSource')?.value)
    .subscribe({
      next: (resp) => {
        if(resp){
          Swal.fire({
            icon: 'success',
            title: 'Beat was added',
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

  }


}

