import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('myForm') myForm!: NgForm;

  validNewEmail:boolean = false;
  validUsername:boolean = false;
  validName:boolean = false;
  validNewPassword:boolean = false;
  validRePassword:boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }


  notValidNewEmail(campo:string): boolean{ 
    let result:boolean= false;

    if(this.myForm?.controls[campo]?.touched){

      if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.myForm?.controls[campo].value)){
          result=false;
      } 
      else {
          result=true;
      }
    }
    this.validNewEmail = result;
      return result;
  }

  notValidUsername(campo:string): boolean{
    let result:boolean= false;
    if(this.myForm?.controls[campo]?.invalid && this.myForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validUsername = result;
    return result
  }

  notValidName(campo:string): boolean{
    let result:boolean= false;
    if(this.myForm?.controls[campo]?.invalid && this.myForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validName = result;
    return result
  }

  notValidNewPassword(campo:string): boolean{
    let result:boolean= false;
    if(this.myForm?.controls[campo]?.invalid && this.myForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validNewPassword = result;
    return result
  }


  save() {
    if(!this.validNewEmail && !this.validUsername){
      Swal.fire(
        'Good job!',
        'You clicked the button!',
        'success'
      )

    }

    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    }

    // this.myForm.resetForm();

  }
}
