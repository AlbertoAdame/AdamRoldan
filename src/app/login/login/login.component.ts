import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('logInForm') logInForm!: NgForm;
  @ViewChild('registerForm') registerForm!: NgForm;

  currentUrl = this.router.url;

  // ************************** CHANGE VIEW ***************************

  view:boolean = false;

  // ************************** VALIDATIONS ***************************

  validLoginUsername:boolean = false;
  validPassword:boolean = false;

  touchedEmail:boolean = false;
  touchedPassword:boolean = false;

  validNewEmail:boolean = false;
  validNewPassword:boolean = false;
  validRepeatNewPassword:boolean = false;
  validUsername:boolean = false;
  validName:boolean = false;

  touchedNewEmail:boolean = false;
  touchedNewPassword:boolean = false;
  touchedRepeatNewPassword:boolean = false;
  touchedUsername:boolean = false;
  touchedName:boolean = false;

  // ************************** TOKEN ***************************

  username:string=""
  password:string="";
  isLoggedIn!:boolean;

    // ************************** REGISTER ***************************


  newEmail:string=""
  newPassword:string="";
  repeatNewPassword:string="";
  newName:string="";
  newUsername:string="";

  constructor(private authService:AuthService, private router:Router, private userService:UserService) { }

  // ************************** TOKEN(actualizar) ***************************

  ngOnInit(): void {
    this.authService.isAuthenticated()
    .subscribe({
      next: (resp) =>{
        if (resp){
          this.isLoggedIn=true;
      }
      else{
        this.isLoggedIn=false;
      }
    }});
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn=false;
  }

   // ************************** LOGIN **************************

  login(){
    // if(this.logInForm.invalid){
    //   this.logInForm.markAllAsTouched();
    //   return;
    // }


    if(!this.validLoginUsername && !this.validPassword && this.touchedEmail && this.touchedPassword){
      this.authService.login(this.username,this.password)
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.isLoggedIn=true;
            this.router.navigate(['/']);
          }
          else {
            this.username=''; 
            this.password='';
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email o contraseña incorrecta',
              
            })
          }
        }
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        confirmButtonColor: '#9e1815',
      })
    }
  }

   // ************************** REGISTER ***************************

  newAccount():void{
    if(!this.validNewEmail && !this.validNewPassword && !this.validRepeatNewPassword && !this.validUsername && !this.validName && this.touchedNewEmail && this.touchedNewPassword && this.touchedRepeatNewPassword && this.touchedUsername && this.touchedName){
      this.userService.newUser(this.newUsername, this.newPassword, this.newName, this.newEmail)
      .subscribe({
        next: (resp) => {
          if(resp) {
            Swal.fire({
              icon: 'error',
              title: 'USUARIO CREADO',
              text: 'comprueba'
            })
            //esto lo haremos para que se recargue y te muestre el login login
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([this.currentUrl]);
            });

          }},
          error: (error) => 
          console.log(error)
      });
    
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',

      })
    }

    
  }


  // ************************** CHANGE VIEW ***************************

  changeView():void{
    this.view = !this.view
  }

  // ************************** LOG IN VALIDATIONS ***************************

  notValidUsernameLogin(campo:string): boolean{ 
    let result:boolean= false;

    if(this.logInForm?.controls[campo]?.touched){
      this.touchedEmail = true;
      // if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.logInForm?.controls[campo].value)){
      //     result=false;
      // } 
      if(this.logInForm?.controls[campo]?.invalid){
        result=true;
      }
      else {
          result=false;
      }
    }
      this.validLoginUsername = result;
      return result;
  }

  notValidPassword(campo:string): boolean{
    let result:boolean= false;
    if(this.logInForm?.controls[campo]?.touched){
      this.touchedPassword = true;
      if(this.logInForm?.controls[campo]?.invalid)
        result = true
      else
        result = false
    }
    this.validPassword = result;
    return result
  }


  // ************************** REGISTER VALIDATIONS *********************+


  notValidNewEmail(campo:string): boolean{ 
    let result:boolean= false;

    if(this.registerForm?.controls[campo]?.touched){
      this.touchedNewEmail = true;
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
    
    if(this.registerForm?.controls[campo]?.touched){
      this.touchedUsername = true;
      if(this.registerForm?.controls[campo]?.invalid)
        result = true
      else
        result = false
    }
    this.validUsername = result;
    return result
  }

  notValidName(campo:string): boolean{
    let result:boolean= false;
    
    if(this.registerForm?.controls[campo]?.touched){
      this.touchedName = true;
      if(this.registerForm?.controls[campo]?.invalid )
        result = true
      else
        result = false
    }
    this.validName = result;
    return result
  }

  notValidNewPassword(campo:string): boolean{
    let result:boolean= false;
    
    if(this.registerForm?.controls[campo]?.touched){
      this.touchedNewPassword = true;
      if(this.registerForm?.controls[campo]?.invalid)
        result = true
      else
        result = false
    }
    this.validNewPassword = result;
    return result
  }

  notValidRepeatNewPassword(campo:string): boolean{
    let result:boolean= false;
    if(this.registerForm?.controls[campo]?.touched){
      this.touchedRepeatNewPassword = true;
      if(this.newPassword != this.repeatNewPassword )
        result = true
      else
        result = false
    }
    this.validRepeatNewPassword = result;
    return result
  }


  saveRegister() {
    if(!this.validNewEmail && !this.validNewPassword && !this.validRepeatNewPassword && !this.validUsername && !this.validName && this.touchedNewEmail && this.touchedNewPassword && this.touchedRepeatNewPassword && this.touchedUsername && this.touchedName){
      Swal.fire(
        'Good job!',
        'You clicked the button!',
        'success',
        
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
