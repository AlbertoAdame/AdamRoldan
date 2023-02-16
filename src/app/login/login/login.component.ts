import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('myForm') myForm!: NgForm;

  validEmail:boolean = false;
  validUsername:boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }


  notValidEmail(campo:string): boolean{ 
    let result:boolean= false;

    if(this.myForm?.controls[campo]?.touched){

      if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.myForm?.controls[campo].value)){
          result=false;
      } 
      else {
          result=true;
      }
    }
    this.validEmail = result;
      return result;
  }

  notValid(campo:string): boolean{
    let result:boolean= false;
    if(this.myForm?.controls[campo]?.invalid && this.myForm?.controls[campo]?.touched)
      result = true
    else
      result = false
    this.validUsername = result;
    return result
  }
  save() {
    if(!this.validEmail && !this.validUsername){
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

    // this.myForm.resetForm({
    //   password:0,
    //   existencias:10
    // })

  }

}
