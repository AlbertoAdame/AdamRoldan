import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('myForm') myForm!: NgForm;


  constructor() { }

  ngOnInit(): void {
    
  }


  notValidEmail(campo:string): boolean{ 
    let result:boolean= false;
    var validRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    if(this.myForm?.controls[campo]?.touched){

      if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.myForm?.controls[campo].value)){
          result=false;
      } 
      else {
          result=true;
      }
    }
    console.log(result)
      return result;
  }

  notValid(campo:string): boolean{
    return this.myForm?.controls[campo]?.invalid &&
      this.myForm?.controls[campo]?.touched
  }
  save() {
    this.myForm.resetForm();

    // this.myForm.resetForm({
    //   password:0,
    //   existencias:10
    // })

  }

}
