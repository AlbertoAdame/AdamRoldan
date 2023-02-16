import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('logInForm') logInForm!: NgForm;
  @ViewChild('registerForm') registerForm!: NgForm;

  view:boolean = false;

  validEmail:boolean = false;
  validPassword:boolean = false;

  validNewEmail:boolean = false;
  validNewPassword:boolean = false;
  validUsername:boolean = false;
  validName:boolean = false;
  validRepeatNewPassword:boolean = false;

  

  constructor() { }

  ngOnInit(): void {
    
  }

  changeView():void{
    this.view = !this.view
  }

    // ************************** LOG IN *********************+

  notValidEmail(campo:string): boolean{ 
    let result:boolean= false;

    if(this.logInForm?.controls[campo]?.touched){

      if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.logInForm?.controls[campo].value)){
          result=false;
      } 
      else {
          result=true;
      }
    }
    this.validEmail = result;
      return result;
  }

  notValidPassword(campo:string): boolean{
    let result:boolean= false;
    if(this.logInForm?.controls[campo]?.invalid && this.logInForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validPassword = result;
    return result
  }
  saveLogIn() {
    if(!this.validEmail && !this.validPassword){
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



  // ************************** REGISTER *********************+


  notValidNewEmail(campo:string): boolean{ 
    let result:boolean= false;

    if(this.registerForm?.controls[campo]?.touched){

      if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.registerForm?.controls[campo].value)){
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
    if(this.registerForm?.controls[campo]?.invalid && this.registerForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validUsername = result;
    return result
  }

  notValidName(campo:string): boolean{
    let result:boolean= false;
    if(this.registerForm?.controls[campo]?.invalid && this.registerForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validName = result;
    return result
  }

  notValidNewPassword(campo:string): boolean{
    let result:boolean= false;
    if(this.registerForm?.controls[campo]?.invalid && this.registerForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validNewPassword = result;
    return result
  }

  notValidRepeatNewPassword(campo:string): boolean{
    let result:boolean= false;
    if(this.registerForm?.controls[campo]?.invalid && this.registerForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validRepeatNewPassword = result;
    return result
  }


  saveRegister() {
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

  }
}
