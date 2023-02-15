import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]],

  })
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  isValidField(field: string){
    return this.myForm.controls[field].errors
    && this.myForm.controls[field].touched
  }

  save(){
    
    if (this.myForm.invalid){

      this.myForm.markAllAsTouched()
      return
    }
    console.log(this.myForm.value)

  }


}

