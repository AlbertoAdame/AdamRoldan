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
    
    if(this.myForm?.controls[campo]?.invalid && this.myForm?.controls[campo]?.touched){

      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(campo)){
          result=true;
      } else {
          result=true;
      }
    }
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
