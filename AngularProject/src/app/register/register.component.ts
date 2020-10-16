import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    private accountService:AccountService,
    private router:Router) { }

  registerForm:  FormGroup;

  userName : FormControl;
  email : FormControl;
  password : FormControl;
  confirmPassword : FormControl;
  
  ngOnInit(): void {
    
    this.userName = new FormControl('',[Validators.required,Validators.minLength(3)]);
    this.email = new FormControl('',[Validators.required,Validators.email]) ;
    this.password = new FormControl('',[Validators.required,Validators.minLength(6)]);
    this.confirmPassword = new FormControl('',[Validators.required,Validators.minLength(6)]);

    this.registerForm = this.fb.group({
      "userName" : this.userName,
      "email" : this.email,
      "password" : this.password,
      "confirmPassword" : this.confirmPassword,
     });
  }
  onRegister(){
    this.accountService
    .register(this.userName.value,this.email.value,this.password.value,this.confirmPassword.value)
    .subscribe(_ => this.router.navigateByUrl('/login'),
    (error: HttpErrorResponse)=>{
      if(error.error){
        console.log(error);
        let e = '';
        error.error.forEach(error => {
          if(error.description)
              e +=  error.description + '\n';
          else
            e = error.error;     
        });
        alert(e);
      }
      else
        alert('UnKnown Error Occur Check your Api Service.');

      console.log(error);
    });
  }
}
