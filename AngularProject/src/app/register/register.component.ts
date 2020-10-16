import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    
    this.userName = new FormControl('',Validators.required);
    this.email = new FormControl('',[Validators.required,Validators.email]) ;
    this.password = new FormControl('',Validators.required);
    this.confirmPassword = new FormControl('',Validators.required);

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
    .subscribe(_ => this.router.navigateByUrl('/login'));
  }
}
